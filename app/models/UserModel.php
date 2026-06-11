<?php

declare(strict_types=1);

class UserModel
{
    /**
     * Get a user by email (used for login)
     */
    public static function getByEmail(PDO $pdo, string $email): ?array
    {
        $sql = "SELECT id, email, first_name, last_name, password_hash, role, is_approved, approved_at, approved_by, last_login_at FROM users WHERE email = :email LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':email' => $email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    /**
     * Get user by ID (used for session validation)
     */
    public static function getById(PDO $pdo, int $id): ?array
    {
        $sql = "SELECT id, email, first_name, last_name, role FROM users WHERE id = :id LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    /**
     * Create a new user (for future use: registration)
     */
    public static function create(PDO $pdo, string $email, string $first_name, string $last_name, string $passwordHash, string $role = 'user'): int
    {
        $sql = "INSERT INTO users (email, first_name, last_name, password_hash, role) VALUES (:email, :first_name, :last_name, :password_hash, :role)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':first_name' => $first_name,
            ':last_name' => $last_name,
            ':email' => $email,
            ':password_hash' => $passwordHash,
            ':role' => $role
        ]);

        return (int)$pdo->lastInsertId();
    }
}
