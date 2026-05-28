<?php

declare(strict_types=1);

require_once __DIR__ . '/../../app/config/bootstrap.php';
require_once __DIR__ . '/../../app/models/CommentModel.php';
require_once __DIR__ . '/../../app/includes/helper.php';

ensure_session();
if (!is_admin_request()) {
    json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
}

$status = $_GET['status'] ?? 'pending';
$page   = max(1, (int)($_GET['page'] ?? 1));
$limit  = max(1, min(100, (int)($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;

try {
    $rows  = CommentModel::listByStatus($pdo, $status, $offset, $limit);
    $total = CommentModel::countByStatus($pdo, $status);
    $pages = (int)ceil($total / $limit);

    // safe display
    foreach ($rows as &$r) {
        $r['body_html'] = nl2br(htmlspecialchars($r['body'] ?? '', ENT_QUOTES, 'UTF-8'));
    }

    json_response(['ok' => true, 'data' => $rows, 'page' => $page, 'pages' => $pages, 'total' => $total]);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => 'Server error'], 500);
}
