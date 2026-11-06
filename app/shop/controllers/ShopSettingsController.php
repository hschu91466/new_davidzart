<?php

declare(strict_types=1);

class ShopSettingsController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function status(): array
    {
        try {
            return [
                'success'    => true,
                'allowed'    => shop_allowed(),
                'store_open' => ShopSettingModel::get($this->pdo, 'store_open') === '1',
                'mode'       => $this->paymentMode(),
            ];
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Unable to load store settings'];
        }
    }

    public function update(array $data): array
    {
        if (!shop_allowed()) {
            return [
                'success' => false,
                'message' => 'The shop is turned off in the server settings'
            ];
        }

        if (!array_key_exists('store_open', $data)) {
            return ['success' => false, 'message' => 'Invalid request'];
        }

        try {
            ShopSettingModel::set(
                $this->pdo,
                'store_open',
                $data['store_open'] ? '1' : '0'
            );

            return $this->status();
        } catch (Throwable $e) {
            return ['success' => false, 'message' => 'Unable to update store settings'];
        }
    }

    private function paymentMode(): string
    {
        $key = $_ENV['STRIPE_SECRET_KEY'] ?? '';

        if (str_starts_with($key, 'sk_live_')) {
            return 'live';
        }

        if (str_starts_with($key, 'sk_test_')) {
            return 'test';
        }

        return 'not set';
    }
}
