<?php

declare(strict_types=1);

class PaymentService
{
    public static function createCheckoutSession(array $items, int $orderId): array
    {
        \Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        $currency  = strtolower($_ENV['SHOP_CURRENCY'] ?? 'usd');
        $countries = array_map(
            'trim',
            explode(',', $_ENV['SHOP_SHIPPING_COUNTRIES'] ?? 'US')
        );
        $siteUrl   = rtrim($_ENV['SITE_URL'] ?? '', '/');

        $lineItems = array_map(fn($item) => [
            'price_data' => [
                'currency'     => $currency,
                'unit_amount'  => (int)$item['unit_price_cents'],
                'product_data' => [
                    'name' => $item['item_title'],
                ],
            ],
            'quantity' => (int)$item['quantity'],
        ], $items);

        $session = \Stripe\Checkout\Session::create([
            'mode'       => 'payment',
            'line_items' => $lineItems,
            'shipping_address_collection' => [
                'allowed_countries' => $countries,
            ],
            'metadata'    => [
                'order_id' => $orderId,
            ],
            'expires_at'  => time() + 1800,
            'success_url' => $siteUrl . '/order-success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => $siteUrl . '/cart',
        ]);

        return [
            'id'  => $session->id,
            'url' => $session->url,
        ];
    }

    public static function verifyWebhook(string $payload, string $signature): ?object
    {
        try {
            return \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                $_ENV['STRIPE_WEBHOOK_SECRET'] ?? ''
            );
        } catch (Throwable) {
            // Signature or payload is invalid, so the request did not come from Stripe
            return null;
        }
    }
}
