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
require_once __DIR__ . '/models/ShopSettingModel.php';
require_once __DIR__ . '/controllers/ShopSettingsController.php';
/*
 * Master switch from .env: is the shop allowed on this site at all?
 */
function shop_allowed(): bool
{
    return ($_ENV['SHOP_ENABLED'] ?? 'false') === 'true';
}

/*
 * The database connection the shop uses for its settings.
 * Set once by this loader from bootstrap's $pdo.
 */
function shop_pdo(?PDO $set = null): ?PDO
{
    static $pdo = null;

    if ($set !== null) {
        $pdo = $set;
    }

    return $pdo;
}

/*
 * Can visitors buy right now? Requires both the .env master switch
 * and the admin's store open setting. Read once per request.
 */
function shop_enabled(): bool
{
    static $enabled = null;

    if ($enabled !== null) {
        return $enabled;
    }

    $enabled = false;

    if (!shop_allowed() || !shop_pdo()) {
        return $enabled;
    }

    try {
        $enabled = ShopSettingModel::get(shop_pdo(), 'store_open') === '1';
    } catch (Throwable $e) {
        // Settings table missing or unreadable: keep the store closed
    }

    return $enabled;
}

function shop_item_types(): array
{
    static $types = null;

    if ($types === null) {
        $types = require __DIR__ . '/items.php';
    }

    return $types;
}

shop_pdo($pdo ?? null);
