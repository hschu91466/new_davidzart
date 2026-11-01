<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/CommentModel.php';
require_once __DIR__ . '/../models/UserModel.php';
require_once __DIR__ . '/../models/OrderModel.php';

class DashboardController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function counts(): array
    {
        try {
            return [
                'success' => true,
                'pending_comments' => CommentModel::countByStatus($this->pdo, 'pending'),
                'pending_users' => UserModel::countByStatus($this->pdo, 0),
                'unread_messages' => ContactModel::countUnread($this->pdo),
                'orders_to_ship' => OrderModel::countByStatus($this->pdo, 'paid')
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
