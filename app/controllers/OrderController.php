<?php

declare(strict_types=1);


require_once __DIR__ . '/../models/ImageModel.php';
require_once __DIR__ . '/../models/OrderItemModel.php';
require_once __DIR__ . '/../models/OrderModel.php';
require_once __DIR__ . '/../services/PaymentService.php';
require_once __DIR__ . '/../includes/helper.php';

class OrderController
{
    private PDO $pdo;

    private const MAX_CART_ITEMS = 50;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function checkout(array $data): array
    {
        if (!shop_enabled()) {
            return ['success' => false, 'message' => 'Purchasing is not available'];
        }

        $requested = $this->normalizeItems($data['items'] ?? []);

        if (empty($requested)) {
            return ['success' => false, 'message' => 'Your cart is empty'];
        }

        if (count($requested) > self::MAX_CART_ITEMS) {
            return ['success' => false, 'message' => 'Too many items in cart'];
        }

        try {
            $lineItems = [];
            $subtotal = 0;

            foreach ($requested as $request) {
                $item = $this->loadItem($request['item_type'], $request['item_id']);

                if (!$item) {
                    return [
                        'success' => false,
                        'message' => 'An item in your cart is no longer available'
                    ];
                }

                if ($request['quantity'] > $item['max_quantity']) {
                    return [
                        'success' => false,
                        'message' => "Only {$item['max_quantity']} of \"{$item['item_title']}\" available"
                    ];
                }

                if (
                    $item['one_of_a_kind']
                    && OrderItemModel::hasActivePending($this->pdo, $item['item_type'], $item['item_id'])
                ) {
                    return [
                        'success' => false,
                        'message' => "\"{$item['item_title']}\" is currently being purchased. Please check back shortly."
                    ];
                }

                $item['quantity'] = $request['quantity'];
                $lineItems[] = $item;
                $subtotal += $item['unit_price_cents'] * $item['quantity'];
            }

            $this->pdo->beginTransaction();

            $orderId = OrderModel::create($this->pdo, $subtotal);

            foreach ($lineItems as $item) {
                OrderItemModel::create($this->pdo, $orderId, $item);
            }

            $this->pdo->commit();

            try {
                $session = PaymentService::createCheckoutSession($lineItems, $orderId);
            } catch (Throwable $e) {
                OrderModel::updateStatus($this->pdo, $orderId, 'cancelled');
                throw $e;
            }

            OrderModel::setSessionId($this->pdo, $orderId, $session['id']);

            return ['success' => true, 'url' => $session['url']];
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            // return ['success' => false, 'message' => 'Unable to start checkout'];
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function handlePaid(object $session): array
    {
        if (($session->payment_status ?? '') !== 'paid') {
            return ['success' => true];
        }

        try {
            $this->pdo->beginTransaction();

            $order = OrderModel::getBySessionId($this->pdo, $session->id);

            if (!$order || $order['status'] !== 'pending') {
                $this->pdo->commit();
                return ['success' => true];
            }

            $details = $session->collected_information->shipping_details
                ?? $session->shipping_details
                ?? null;

            OrderModel::markPaid($this->pdo, (int)$order['order_id'], [
                'shipping_cents' => (int)($session->total_details->amount_shipping ?? 0),
                'total_cents'    => (int)($session->amount_total ?? $order['subtotal_cents']),
                'name'           => $session->customer_details->name ?? '',
                'email'          => $session->customer_details->email ?? '',
                'address'        => json_encode($details->address ?? null),
            ]);

            $items = OrderItemModel::getByOrder($this->pdo, (int)$order['order_id']);

            foreach ($items as $item) {
                $this->fulfillItem($item);
            }

            $this->pdo->commit();
            return ['success' => true];
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function handleExpired(object $session): array
    {
        try {
            $order = OrderModel::getBySessionId($this->pdo, $session->id);

            if ($order && $order['status'] === 'pending') {
                OrderModel::updateStatus($this->pdo, (int)$order['order_id'], 'cancelled');
            }

            return ['success' => true];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function list(): array
    {
        try {
            $orders = OrderModel::listAll($this->pdo);

            $orderIds = array_column($orders, 'order_id');
            $items = OrderItemModel::getByOrderIds($this->pdo, $orderIds);

            $itemsByOrder = [];
            foreach ($items as $item) {
                $itemsByOrder[$item['order_id']][] = $item;
            }

            foreach ($orders as &$order) {
                $order['items'] = $itemsByOrder[$order['order_id']] ?? [];
            }
            unset($order);

            return ['success' => true, 'orders' => $orders];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Unable to load orders'];
        }
    }

    public function updateStatus(array $data): array
    {
        $orderId = (int)($data['order_id'] ?? 0);
        $status  = $data['status'] ?? '';

        $allowed = ['paid', 'shipped', 'cancelled'];

        if ($orderId <= 0 || !in_array($status, $allowed, true)) {
            return ['success' => false, 'message' => 'Invalid request'];
        }

        try {
            OrderModel::updateStatus($this->pdo, $orderId, $status);
            return ['success' => true];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Unable to update order'];
        }
    }

    /* ---------- Private helpers ---------- */

    private function normalizeItems(mixed $items): array
    {
        if (!is_array($items)) {
            return [];
        }

        $merged = [];

        foreach ($items as $item) {
            $type     = $item['item_type'] ?? '';
            $id       = (int)($item['item_id'] ?? 0);
            $quantity = (int)($item['quantity'] ?? 1);

            if (!in_array($type, ['image', 'product'], true) || $id <= 0 || $quantity <= 0) {
                continue;
            }

            $key = "{$type}:{$id}";

            if (isset($merged[$key])) {
                $merged[$key]['quantity'] += $quantity;
            } else {
                $merged[$key] = [
                    'item_type' => $type,
                    'item_id'   => $id,
                    'quantity'  => $quantity,
                ];
            }
        }

        return array_values($merged);
    }

    private function loadItem(string $type, int $id): ?array
    {
        if ($type === 'image') {
            $image = ImageModel::getById($this->pdo, $id);

            if (
                !$image
                || !$image['is_published']
                || !$image['is_active']
                || $image['is_sold']
                || empty($image['price_cents'])
            ) {
                return null;
            }

            return [
                'item_type'        => 'image',
                'item_id'          => (int)$image['image_id'],
                'item_title'       => $image['title'] ?: 'Untitled',
                'unit_price_cents' => (int)$image['price_cents'],
                'max_quantity'     => 1,
                'one_of_a_kind'    => true,
            ];
        }

        // Products are added here when ProductModel exists.
        return null;
    }

    private function fulfillItem(array $item): void
    {
        if ($item['item_type'] === 'image') {
            ImageModel::markSold($this->pdo, (int)$item['item_id']);
            return;
        }

        // Product quantity decrement is added here when ProductModel exists.
    }
}
