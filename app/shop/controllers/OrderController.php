<?php

declare(strict_types=1);

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
            return ['success' => false, 'message' => 'Unable to start checkout'];
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

    public function counts(): array
    {
        try {
            return [
                'success'        => true,
                'orders_to_ship' => OrderModel::countByStatus($this->pdo, 'paid'),
            ];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Unable to load order counts'];
        }
    }

    /* ---------- Private helpers ---------- */

    private function normalizeItems(mixed $items): array
    {
        if (!is_array($items)) {
            return [];
        }

        $types = array_keys(shop_item_types());
        $merged = [];

        foreach ($items as $item) {
            $type     = $item['item_type'] ?? '';
            $id       = (int)($item['item_id'] ?? 0);
            $quantity = (int)($item['quantity'] ?? 1);

            if (!in_array($type, $types, true) || $id <= 0 || $quantity <= 0) {
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
        $class = shop_item_types()[$type] ?? null;

        return $class ? $class::load($this->pdo, $id) : null;
    }

    private function fulfillItem(array $item): void
    {
        $class = shop_item_types()[$item['item_type']] ?? null;

        if ($class) {
            $class::fulfill($this->pdo, (int)$item['item_id'], (int)$item['quantity']);
        }
    }
}
