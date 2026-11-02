<?php

declare(strict_types=1);

/*
 * SHOP ITEM TYPES
 * Lists what this site sells. This is the only shop file that
 * differs between sites. Do not overwrite it when updating the
 * shop module from another site.
 */

require_once __DIR__ . '/items/ImageShopItem.php';
// require_once __DIR__ . '/items/ProductShopItem.php';

return [
    'image'   => ImageShopItem::class,
    // 'product' => ProductShopItem::class,
];
