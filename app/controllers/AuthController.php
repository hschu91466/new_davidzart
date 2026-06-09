<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/UserModel.php';

class AuthController
{
    public static function login(PDO $pdo, string $email, string $password): array
    {
        if (empty($email) || empty($password)) {
            http_response_code(400);
            return ["error" => "Email and password required"];
        }

        $user = UserModel::getByEmail($pdo, $email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            return ["error" => "Invalid credentials"];
        }

        // ✅ Session logic belongs here (business logic)

        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'role' => $user['role']
        ];

        return [
            "message" => "Login successful",
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "first_name" => $user['first_name'],
                "last_name" => $user['last_name'],
                "name" => $user['first_name'] . ' ' . $user['last_name'],
                "role" => $user['role']
            ]
        ];
    }

    public static function logout(): array
    {
        $_SESSION = [];
        session_destroy();
        return ["message" => "Logged out"];
    }

    public static function currentUser(PDO $pdo): ?array
    {
        if (!isset($_SESSION['user'])) {
            return null;
        }

        return $_SESSION['user'];
    }


    public static function register(PDO $pdo, array $data): array
    {

        $firstName = trim($data['first_name'] ?? '');
        $lastName  = trim($data['last_name'] ?? '');
        $email     = trim($data['email'] ?? '');
        $password  = $data['password'] ?? '';

        $errors = [];

        //Validations
        if ($firstName === '') {
            $errors[] = "First name required";
        }

        if ($lastName === '') {
            $errors[] = "Last name required";
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Valid email required";
        }

        if (strlen($password) < 6) {
            $errors[] = "Password must be at least 6 characters";
        }

        if (!empty($errors)) {
            return [
                "ok" => false,
                "errors" => $errors
            ];
        }


        // Check if email already exists
        $existing = UserModel::getByEmail($pdo, $email);

        if ($existing) {
            return [
                "ok" => false,
                "error" => "Email already registered"
            ];
        }


        // Hash password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        //Create User

        $userId = UserModel::create($pdo, $email, $firstName, $lastName, $passwordHash, "user");

        $_SESSION['user'] = [
            'id' => $userId,
            'email' => $email,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'role' => 'user'
        ];

        return [
            "ok" => true,
            "message" => "Account created successfully",
            "user" => [
                "id" => $userId,
                "email" => $email,
                "first_name" => $firstName,
                "last_name" => $lastName,
                "name" => $firstName . ' ' . $lastName,
                "role" => "user"
            ]
        ];
    }
}
