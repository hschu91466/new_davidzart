<?php

declare(strict_types=1);

// public/api/comments-create.php
require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/models/CommentModel.php';
require_once __DIR__ . '/../../app/includes/helper.php';

header('Content-Type: application/json; charset=utf-8');

ensure_session();

// CSRF
$csrf = $_POST['csrf_token'] ?? '';
if ($csrf === '' || $csrf !== ($_SESSION['csrf_token'] ?? '')) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid session token.']);
    exit;
}

// Spam: honeypot + minimum fill time + simple rate limit
$honeypot   = trim($_POST['website_url_hp'] ?? '');
$formStart  = (int)($_POST['form_start_ts'] ?? 0);
$tooFast    = (time() - $formStart) < 3;
$isSpam     = ($honeypot !== '') || $tooFast;

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if (isset($_SESSION['last_comment_ts']) && (time() - $_SESSION['last_comment_ts']) < 60) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'You are commenting too fast. Please wait a moment.']);
    exit;
}

$type  = $_POST['content_type'] ?? 'image';
$id    = (int)($_POST['content_id'] ?? 0);
$name  = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$body  = trim($_POST['comment'] ?? '');

$errors = [];
if ($id <= 0) {
    $errors[] = 'Invalid content.';
}
if ($name === '') {
    $errors[] = 'Name is required.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email required.';
}
if ($body === '') {
    $errors[] = 'Comment is required.';
}

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

try {
    $newId = CommentModel::create($pdo, [
        'content_type' => $type,
        'content_id'   => $id,
        'parent_id'    => null, // flat thread for now
        'name'         => $name,
        'email'        => $email,
        'website'      => null,
        'body'         => $body,
        'is_approved'  => 0,               // pre-moderation
        'is_spam'      => $isSpam ? 1 : 0,
        'ip_address'   => $ip,
        'user_agent'   => $_SERVER['HTTP_USER_AGENT'] ?? '',
    ]);

    $_SESSION['last_comment_ts'] = time();

    echo json_encode([
        'ok'      => true,
        'id'      => $newId,
        'status'  => $isSpam ? 'flagged' : 'pending',
        'message' => $isSpam
            ? 'Thanks! Your comment was received and is under review.'
            : 'Thanks! Your comment is pending approval.',
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server error']);
}
