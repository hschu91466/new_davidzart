<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/ContactModel.php';

class ContactService
{
    public function sendMessage(PDO $pdo, array $data): array
    {

        $success = ContactModel::sendMessage($pdo, $data);

        if (!$success) {
            return [
                "success" => false,
                "message" => "Failed to save message ❌"
            ];
        }

        return [
            "success" => true,
            "message" => "Message sent"
        ];
    }

    public function getMessages(): array
    {

        $messages = ContactModel::getAllMessages();

        return [
            "success" => true,
            "data" => $messages
        ];
    }


    public function markRead(PDO $pdo, int $id ): array
    {
        $success = ContactModel::markAsRead($pdo, $id );

        return [
            "success" => $success,
            "message" => $success ? "Marked as read ✅" : "Failed ❌"
        ];
    }


    public function delete( PDO $pdo, int $id): array
    {
        $success = ContactModel::deleteMessage($pdo, $id);

        return [
            "success" => $success,
            "message" => $success ? "Deleted ✅" : "Failed ❌"
        ];
    }
}