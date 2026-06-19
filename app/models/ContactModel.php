<?php

declare(strict_types=1);

class ContactModel
{
    public static function sendMessage(PDO $pdo, array $data): bool
    {

        $sql = "INSERT INTO contact_messages (name, email, message) 
                VALUES (:name, :email, :message)";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':message' => $data['message']
        ]);
    }

    public static function getAllMessages(): array
    {

        $pdo = db();

        $stmt = $pdo->query("
        SELECT message_id, name, email, message, created_at, is_read
        FROM contact_messages
        ORDER BY created_at DESC
    ");

        return $stmt->fetchAll();
    }

    public static function markAsRead(PDO $pdo, int $id): bool
    {

        $stmt = $pdo->prepare("
        UPDATE contact_messages
        SET is_read = 1
        WHERE message_id = :id
    ");

        return $stmt->execute([':id' => $id]);
    }


    public static function deleteMessage(PDO $pdo, int $id): bool
    {

        $stmt = $pdo->prepare("
        DELETE FROM contact_messages
        WHERE message_id = :id
    ");

        return $stmt->execute([':id' => $id]);
    }
}
