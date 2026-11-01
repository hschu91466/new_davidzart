<?php

declare(strict_types=1);

ini_set('display_errors', '1');
error_reporting(E_ALL);

require_once __DIR__ . '/../../../app/config/bootstrap.php';
require_once __DIR__ . '/../../../app/controllers/OrderController.php';

$payload = file_get_contents('php://input');
$sig = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

try {
$event = \Stripe\Webhook::constructEvent($payload, $sig, $_ENV['STRIPE_WEBHOOK_SECRET']);
} catch (Exception $e) {
http_response_code(400);
exit;
}

$controller = new OrderController($pdo);

$response = match ($event->type) {
'checkout.session.completed' => $controller->handlePaid($event->data->object),
'checkout.session.expired' => $controller->handleExpired($event->data->object),
default => ['success' => true],
};

json_response($response);