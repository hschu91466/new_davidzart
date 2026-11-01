<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/DashboardController.php';
require_once __DIR__ . '/../../../app/models/CommentModel.php';
require_once __DIR__ . '/../../../app/models/UserModel.php';
require_once __DIR__ . '/../../../app/models/ContactModel.php';

require_admin();

$controller = new DashboardController($pdo);
$response = $controller->counts();

json_response($response);
