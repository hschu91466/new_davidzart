<?php

declare(strict_types=1);

// public/api/comments-list.php
require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/models/CommentModel.php';

header('Content-Type: application/json; charset=utf-8');

$type   = $_GET['content_type'] ?? 'image';
$id     = (int)($_GET['content_id'] ?? 0);
$page   = max(1, (int)($_GET['page'] ?? 1));
$limit  = max(1, min(50, (int)($_GET['limit'] ?? 10)));
$offset = ($page - 1) * $limit;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid content_id']);
    exit;
}

try {
    $rows  = CommentModel::listByContent($pdo, $type, $id, $offset, $limit, true);
    $total = CommentModel::countByContent($pdo, $type, $id, true);
    $pages = (int)ceil($total / $limit);

    foreach ($rows as &$r) {
        $r['body_html'] = nl2br(htmlspecialchars($r['body'] ?? '', ENT_QUOTES, 'UTF-8'));
    }

    echo json_encode(['ok' => true, 'data' => $rows, 'page' => $page, 'pages' => $pages, 'total' => $total]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server error']);
}
