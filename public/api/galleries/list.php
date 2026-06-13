<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/models/GalleryModel.php';

$galleries = GalleryModel::getActive($pdo);

// echo json_encode($galleries);

json_ok($galleries);
