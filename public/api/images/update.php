<?php

declare(strict_types=1);

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/models/ImageModel.php';

$data = json_decode(file_get_contents("php://input"), true);

ImageModel::update($pdo, $data);

json_ok($data);