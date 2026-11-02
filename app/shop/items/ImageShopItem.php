<?php

declare(strict_types=1);

class ImageShopItem
{
    public static function load(PDO $pdo, int $id): ?array
    {
        $sql = "
            SELECT image_id, title, price_cents, is_sold, is_active, is_published
            FROM images
            WHERE image_id = :id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id
        ]);

        $image = $stmt->fetch(PDO::FETCH_ASSOC);

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

    public static function fulfill(PDO $pdo, int $id, int $quantity): void
    {
        $sql = "
            UPDATE images
            SET is_sold = 1
            WHERE image_id = :id
              AND is_sold = 0
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id
        ]);
    }
}
