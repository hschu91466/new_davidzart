<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/UserModel.php';

class AuthController
{

    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }
    public function login(string $email, string $password): array
    {
        if (empty($email) || empty($password)) {
            return ["error" => "Email and password required"];
        }

        $user = UserModel::getByEmail($this->pdo, $email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return ["error" => "Invalid credentials"];
        }

        if (!$user['is_approved']) {
            return [
                "ok" => false,
                "error" => "Account pending approval"
            ];
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
    public function logout(): array
    {
        $_SESSION = [];
        session_destroy();
        return ["message" => "Logged out"];
    }
    public function currentUser(): ?array
    {
        if (!isset($_SESSION['user'])) {
            return ['ok' => false, 'user' => null];
        }

        $user = $_SESSION['user'];

        $user['name'] = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));


        return [
            'ok' => true,
            'user' => $user
        ];
    }
    public function register(array $data): array
    {
        $firstName = trim($data['first_name'] ?? '');
        $lastName  = trim($data['last_name'] ?? '');
        $email     = trim($data['email'] ?? '');
        $password  = $data['password'] ?? '';
        $confirmPassword = $data['confirmPassword'] ?? '';

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

        if ($password !== $confirmPassword) {
            $errors[] = "Passwords do not match";
        }

        if (!empty($errors)) {
            return [
                "ok" => false,
                "errors" => $errors
            ];
        }

        // Check if email already exists
        $existing = UserModel::getByEmail($this->pdo, $email);

        if ($existing) {
            return [
                "ok" => false,
                "error" => "Email already registered"
            ];
        }

        // Hash password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        //Create User
        $userId = UserModel::create($this->pdo, $email, $firstName, $lastName, $passwordHash, "user");

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
    public function changePassword(array $data): array
    {
        $currentPassword = $data['currentPassword'] ?? '';
        $newPassword = $data['newPassword'] ?? '';

        $errors = [];

        // Validate required fields
        if ($currentPassword === '') {
            $errors[] = "Current password is required";
        }

        if ($newPassword === '') {
            $errors[] = "New password is required";
        }

        if (strlen($newPassword) < 6) {
            $errors[] = "Password must be at least 6 characters";
        }

        if ($currentPassword === $newPassword) {
            $errors[] = "New password must be different from current password";
        }

        if (!empty($errors)) {
            return [
                "ok" => false,
                "errors" => $errors
            ];
        }

        try {
            // Get current user from session
            if (!isset($_SESSION['user']['id'])) {
                return [
                    "ok" => false,
                    "error" => "Not authenticated"
                ];
            }

            $userId = $_SESSION['user']['id'];

            // Get user from database
            $user = UserModel::getById($this->pdo, $userId);

            if (!$user) {
                return [
                    "ok" => false,
                    "error" => "User not found"
                ];
            }

            // Verify current password
            if (!password_verify($currentPassword, $user['password_hash'])) {
                return [
                    "ok" => false,
                    "error" => "Current password is incorrect"
                ];
            }

            // Hash new password
            $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);

            // Update password in database
            UserModel::updatePassword($this->pdo, $userId, $passwordHash);

            return [
                "ok" => true,
                "message" => "Password changed successfully"
            ];
        } catch (Exception $e) {
            return [
                "ok" => false,
                "error" => "Failed to change password: " . $e->getMessage()
            ];
        }
    }
}
