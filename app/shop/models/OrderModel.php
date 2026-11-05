<?php

declare(strict_types=1);

class OrderModel
{
    public static function create(PDO $pdo, int $subtotalCents, string $releaseToken): int
    {
        $sql = "
        INSERT INTO orders (subtotal_cents, shipping_cents, total_cents, release_token, status)
        VALUES (:subtotal, 0, :total, :release_token, 'pending')";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':subtotal'      => $subtotalCents,
            ':total'         => $subtotalCents,
            ':release_token' => $releaseToken
        ]);

        return (int)$pdo->lastInsertId();
    }

    public static function getById(PDO $pdo, int $orderId): array|false
    {
        $sql = "
        SELECT *
        FROM orders
        WHERE order_id = :order_id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':order_id' => $orderId
        ]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function setSessionId(PDO $pdo, int $orderId, string $sessionId): void
    {
        $sql = "
            UPDATE orders
            SET stripe_session_id = :session_id
            WHERE order_id = :order_id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':session_id' => $sessionId,
            ':order_id'   => $orderId
        ]);
    }

    public static function getBySessionId(PDO $pdo, string $sessionId): array|false
    {
        $sql = "
            SELECT *
            FROM orders
            WHERE stripe_session_id = :session_id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':session_id' => $sessionId
        ]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function markPaid(PDO $pdo, int $orderId, array $payment): void
    {
        $sql = "
            UPDATE orders
            SET status = 'paid',
                paid_at = NOW(),
                shipping_cents = :shipping,
                total_cents = :total,
                customer_name = :name,
                customer_email = :email,
                shipping_address = :address
            WHERE order_id = :order_id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':shipping' => $payment['shipping_cents'],
            ':total'    => $payment['total_cents'],
            ':name'     => $payment['name'],
            ':email'    => $payment['email'],
            ':address'  => $payment['address'],
            ':order_id' => $orderId
        ]);
    }

    public static function updateStatus(PDO $pdo, int $orderId, string $status): void
    {
        $sql = "
            UPDATE orders
            SET status = :status
            WHERE order_id = :order_id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':status'   => $status,
            ':order_id' => $orderId
        ]);
    }

    public static function listAll(PDO $pdo): array
    {
        $sql = "
            SELECT *
            FROM orders
            ORDER BY created_at DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function countByStatus(PDO $pdo, string $status): int
    {
        $sql = "
            SELECT COUNT(*) AS total
            FROM orders
            WHERE status = :status
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':status' => $status
        ]);

        return (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];
    }
}
