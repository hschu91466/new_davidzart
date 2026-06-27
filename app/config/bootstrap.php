<?php

declare(strict_types=1);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// // Test if error_log works
// error_log("TEST: Error log is working");
// echo "Check your error log file";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() !== PHP_SESSION_ACTIVE) {

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',          // ✅ CRITICAL FIX
        'domain' => '',
        'secure' => false,      // ✅ fine for localhost
        'httponly' => true,
        'samesite' => 'Lax'     // ✅ important for dev setups
    ]);

    session_start();
}


$ROOT = dirname(__DIR__); // /app
require_once $ROOT . '/config/database.php'; // db(), $pdo
require_once $ROOT . '/includes/helper.php';
require_once $ROOT . '/../vendor/autoload.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// Optional: initialize $pdo explicitly for legacy pages
$pdo = db();
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
