<?php

declare(strict_types=1);

class ShopFields
{
    /*
     * Shop fields for the frontend, built from a database row.
     * Works for images (is_sold) and products (quantity).
     */
    public static function fromRow(array $row): array
    {
        $priceCents = isset($row['price_cents']) ? (int)$row['price_cents'] : null;

        if (array_key_exists('quantity', $row)) {
            $maxQuantity = max(0, (int)$row['quantity']);
            $isSold      = $maxQuantity === 0;
        } else {
            $isSold      = (bool)($row['is_sold'] ?? false);
            $maxQuantity = $isSold ? 0 : 1;
        }

        return [
            'price_cents'  => $priceCents,
            'is_sold'      => $isSold,
            'max_quantity' => $maxQuantity,
            'can_buy'      => shop_enabled() && $priceCents > 0 && !$isSold,
        ];
    }

    /*
     * Price to save, from what the admin typed.
     * Returns ['price_cents' => int|null] or ['error' => message].
     */
    public static function resolvePrice(array $data, array $existing): array
    {
        $isSold = array_key_exists('quantity', $existing)
            ? (int)$existing['quantity'] === 0
            : (bool)($existing['is_sold'] ?? false);

        if ($isSold || !array_key_exists('price', $data)) {
            return ['price_cents' => $existing['price_cents'] ?? null];
        }

        $input = trim(str_replace([',', '$'], '', (string)$data['price']));

        if ($input === '') {
            return ['price_cents' => null];
        }

        if (!is_numeric($input) || (float)$input < 0) {
            return ['error' => 'Price must be a positive number'];
        }

        return ['price_cents' => (int)round((float)$input * 100)];
    }
}
