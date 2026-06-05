<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/CommentModel.php';

class CommentsController
{
    /**
     * Get approved comments for a specific content item
     */
    public function list(array $params): array
    {
        global $pdo;

        // --- Input handling ---
        $contentType = $params['content_type'] ?? 'image';
        $contentId   = (int)($params['content_id'] ?? 0);

        $page  = max(1, (int)($params['page'] ?? 1));
        $limit = max(1, min(50, (int)($params['limit'] ?? 10)));
        $offset = ($page - 1) * $limit;

        // --- Validation ---
        if ($contentId <= 0) {
            return [
                'ok' => false,
                'error' => 'Invalid content_id'
            ];
        }

        try {
            // --- Model calls ---
            $rows = CommentModel::listByContent(
                $pdo,
                $contentType,
                $contentId,
                $offset,
                $limit,
                true // approved only
            );

            $total = CommentModel::countByContent(
                $pdo,
                $contentType,
                $contentId,
                true
            );

            $pages = max(1, (int) ceil($total / $limit));

            // IMPORTANT: return RAW data only (no HTML)
            return [
                'ok' => true,
                'data' => $rows,
                'page' => $page,
                'pages' => $pages,
                'total' => $total
            ];
        } catch (Throwable $e) {
            return [
                'ok' => false,
                'error' => 'Server error'
            ];
        }
    }

    /**
     * Create a new comment
     */
    public function create(array $data): array
    {
        global $pdo;


        ensure_session();

        // CSRF check - disabled until adding admin
        // $csrfToken = $data['csrf_token'] ?? '';
        // if (!csrf_validate($csrfToken)) {
        //     return [
        //         'ok' => false,
        //         'error' => 'Invalid session token.'
        //     ];
        // }

        // --- Input handling ---
        $contentType = $data['content_type'] ?? 'image';
        $contentId   = (int)($data['content_id'] ?? 0);
        $name        = trim($data['name'] ?? '');
        $email       = trim($data['email'] ?? '');
        $comment     = trim($data['body'] ?? '');

        // --- Validation ---
        $errors = [];

        if ($contentId <= 0) {
            $errors[] = 'Invalid content.';
        }

        if ($name === '') {
            $errors[] = 'Name is required.';
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Valid email required.';
        }

        if ($comment === '') {
            $errors[] = 'Comment is required.';
        }

        if (!empty($errors)) {
            return [
                'ok' => false,
                'errors' => $errors
            ];
        }

        // --- Simple rate limit (session-based) ---
        if (isset($_SESSION['last_comment_ts']) && (time() - $_SESSION['last_comment_ts']) < 60) {
            return [
                'ok' => false,
                'error' => 'You are commenting too fast. Please wait a moment.'
            ];
        }

        try {
            // --- Insert via model ---
            $isApproved = isset($_SESSION['user_id']) ? 1 : 0;
            $newId = CommentModel::create($pdo, [
                'content_type' => $contentType,
                'content_id'  => $contentId,
                'parent_id'   => null,
                'name'        => $name,
                'email'       => $email,
                'website'     => null,
                'body'        => $comment,
                'is_approved' => $isApproved,
                'is_spam'     => 0,
                'ip_address'  => $_SERVER['REMOTE_ADDR'] ?? '',
                'user_agent'  => $_SERVER['HTTP_USER_AGENT'] ?? '',
            ]);

            // update rate limit timestamp
            $_SESSION['last_comment_ts'] = time();
            error_log("SESSION USER ID: " . ($_SESSION['user_id'] ?? 'NOT SET'));

            $message = $isApproved ? 'Comment posted successfully.' : 'Thanks! Your comment is pending approval.';

            return [
                'ok' => true,
                'id' => $newId,
                'message' => $message,
            ];
        } catch (Throwable $e) {
            return [
                'ok' => false,
                'error' => 'Server error'
            ];
        }
    }

    /**
     * Approve a comment (admin only)
     */
    public function approve(int $id): array
    {
        global $pdo;
        error_log("APPROVE ID: " . $id);
        // --- Basic validation ---
        if ($id <= 0) {
            return [
                'ok' => false,
                'error' => 'Missing or Invalid id'
            ];
        }

        // --- Admin check ---
        if (!is_admin_request()) {
            return [
                'ok' => false,
                'error' => 'Unauthorized'
            ];
        }

        try {
            $ok = CommentModel::approve($pdo, $id);

            if (!$ok) {
                return [
                    'ok' => false,
                    'error' => 'Not found'
                ];
            }

            return [
                'ok' => true,
                'id' => $id
            ];
        } catch (Throwable $e) {
            return [
                'ok' => false,
                'error' => 'Server error'
            ];
        }
    }
}
