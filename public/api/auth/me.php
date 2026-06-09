<?php

declare(strict_types=1);

require_once __DIR__ . '/../../../app/config/bootstrap.php';

ensure_session();   // ✅ after bootstrap

error_log("SESSION CONTENT:");
error_log(print_r($_SESSION, true));

// ✅ DO NOT use controller for now — use session directly
$user = $_SESSION['user'] ?? null;

if ($user) {
    $user['name'] = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));
}

echo json_encode([
    "ok" => true,
    "user" => $user
]);
