<?php

declare(strict_types=1);

// TEMP: keep while testing, remove later
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

header('Content-Type: application/json');

// --------------------------------------------------
// Resolve app root
// --------------------------------------------------
$APP_ROOT = dirname(__DIR__, 2); // /sites/new.davidzart

// --------------------------------------------------
// Bootstrap backend
// --------------------------------------------------
require_once $APP_ROOT . '/app/config/database.php';
require_once $APP_ROOT . '/app/controllers/GalleryApiController.php';

// --------------------------------------------------
// Ensure PDO exists
// --------------------------------------------------
if (!isset($pdo) || !($pdo instanceof PDO)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection unavailable']);
    exit;
}

// --------------------------------------------------
// Route request
// --------------------------------------------------
$controller = new GalleryApiController($pdo);

$path = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$path = preg_replace('#^/api#', '', $path);

switch ($path) {
    case '/galleries':
        $controller->galleries();
        break;

    case '/gallery':
        $controller->gallery(); // ?slug=
        break;

    case '/images':
        $controller->images();
        break;

    default:
        http_response_code(404);
        echo json_encode([
            'error' => 'API endpoint not found',
            'path'  => $path
        ]);
}
