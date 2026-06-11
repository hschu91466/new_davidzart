<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/UserModel.php';

class UserController
{

    public function listAdmin(array $params): array
    {
        global $pdo;

        $status = $params['status'] ?? 'pending';

        if ($status === 'approved') {
            $sql = "SELECT * FROM users WHERE is_approved = 1 ORDER BY created_at DESC";
        } else {
            $sql = "SELECT * FROM users WHERE is_approved = 0 ORDER BY created_at DESC";
        }

        $stmt = $pdo->query($sql);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'ok' => true,
            'users' => $users
        ];
    }

    public function approve(array $data): array
    {
        global $pdo;

        $userId = (int)($data['user_id'] ?? 0);

        if ($userId <= 0) {
            return [
                'ok' => false,
                'error' => 'Invalid user ID'
            ];
        }

        try {
            $stmt = $pdo->prepare("
            UPDATE users
            SET is_approved = 1,
                approved_at = NOW(),
                approved_by = :admin_id
            WHERE id = :id
        ");

            $stmt->execute([
                ':id' => $userId,
                ':admin_id' => $_SESSION['user']['id'] ?? null
            ]);

            return [
                'ok' => true,
                'message' => 'User approved successfully'
            ];
        } catch (Throwable $e) {
            return [
                'ok' => false,
                'error' => 'Failed to approve user'
            ];
        }
    }

    public function delete(array $data): array
    {
        global $pdo;

        $userId = (int)($data['user_id'] ?? 0);

        if ($userId <= 0) {
            return [
                'ok' => false,
                'error' => 'Invalid user ID'
            ];
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");

            $stmt->execute([
                ':id' => $userId
            ]);

            return [
                'ok' => true,
                'message' => 'User deleted successfully'
            ];
        } catch (Throwable $e) {
            return [
                'ok' => false,
                'error' => 'Failed to delete user'
            ];
        }
    }
}
