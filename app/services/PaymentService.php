<?php

declare(strict_types=1);

class PaymentService
{
    public static function createCheckoutSession(array $items, int $orderId): array
    {
        \Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        $lineItems = array_map(fn($item) => [
            'price_data' => [
                'currency'     => 'usd',
                'unit_amount'  => (int)$item['unit_price_cents'],
                'product_data' => [
                    'name' => $item['item_title'],
                ],
            ],
            'quantity' => (int)$item['quantity'],
        ], $items);

        $session = \Stripe\Checkout\Session::create([
            'mode'        => 'payment',
            'line_items'  => $lineItems,
            'shipping_address_collection' => [
                'allowed_countries' => ['US'],
            ],
            'metadata'    => [
                'order_id' => $orderId,
            ],
            'expires_at'  => time() + 1800,
            'success_url' => $_ENV['SITE_URL'] . '/order-success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => $_ENV['SITE_URL'] . '/cart',
        ]);

        return [
            'id'  => $session->id,
            'url' => $session->url,
        ];
    }
}
