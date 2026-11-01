<?php

declare(strict_types=1);

class OrderItemModel
{
    public static function create(PDO $pdo, int $orderId, array $item): int
    {
        $sql = "
            INSERT INTO order_items
                (order_id, item_type, item_id, item_title, unit_price_cents, quantity)
            VALUES
                (:order_id, :item_type, :item_id, :item_title, :unit_price, :quantity)
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':order_id'   => $orderId,
            ':item_type'  => $item['item_type'],
            ':item_id'    => $item['item_id'],
            ':item_title' => $item['item_title'],
            ':unit_price' => $item['unit_price_cents'],
            ':quantity'   => $item['quantity']
        ]);

        return (int)$pdo->lastInsertId();
    }

    public static function getByOrder(PDO $pdo, int $orderId): array
    {
        $sql = "
            SELECT *
            FROM order_items
            WHERE order_id = :order_id
            ORDER BY order_item_id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':order_id' => $orderId
        ]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getByOrderIds(PDO $pdo, array $orderIds): array
    {
        if (empty($orderIds)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($orderIds), '?'));

        $sql = "
            SELECT *
            FROM order_items
            WHERE order_id IN ($placeholders)
            ORDER BY order_id, order_item_id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(array_map('intval', $orderIds));

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function hasActivePending(PDO $pdo, string $itemType, int $itemId): bool
    {
        $sql = "
            SELECT COUNT(*)
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE oi.item_type = :item_type
              AND oi.item_id = :item_id
              AND o.status = 'pending'
              AND o.created_at > NOW() - INTERVAL 30 MINUTE
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':item_type' => $itemType,
            ':item_id'   => $itemId
        ]);

        return (int)$stmt->fetchColumn() > 0;
    }
}
