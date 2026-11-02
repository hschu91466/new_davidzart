<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';

$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

$event = PaymentService::verifyWebhook($payload, $signature);

if (!$event) {
    json_response(['success' => false, 'message' => 'Invalid webhook'], 400);
}

$controller = new OrderController($pdo);

$response = match ($event->type) {
    'checkout.session.completed' => $controller->handlePaid($event->data->object),
    'checkout.session.expired'   => $controller->handleExpired($event->data->object),
    default                      => ['success' => true],
};

json_response($response, $response['success'] ? 200 : 500);
