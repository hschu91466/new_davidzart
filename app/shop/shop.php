<?php

declare(strict_types=1);

/*
 * SHOP MODULE LOADER
 * Loaded once from bootstrap.php. Loads every shop class and
 * provides the shop's global helper functions.
 */

require_once __DIR__ . '/models/OrderModel.php';
require_once __DIR__ . '/models/OrderItemModel.php';
require_once __DIR__ . '/services/PaymentService.php';
require_once __DIR__ . '/ShopFields.php';
require_once __DIR__ . '/controllers/OrderController.php';

function shop_enabled(): bool
{
    return ($_ENV['SHOP_ENABLED'] ?? 'false') === 'true';
}

function shop_item_types(): array
{
    static $types = null;

    if ($types === null) {
        $types = require __DIR__ . '/items.php';
    }

    return $types;
}
