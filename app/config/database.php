<?php

declare(strict_types=1);

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    // 1) Load Composer autoload once
    $vendorAutoload = __DIR__ . '/../../vendor/autoload.php';
    if (file_exists($vendorAutoload)) {
        require_once $vendorAutoload;
    } else {
        throw new RuntimeException("Composer autoload not found at {$vendorAutoload}");
    }

    // 2) Load .env (project root two levels up from /app/config)
    $envRoot = __DIR__ . '/../../';
    if (class_exists(\Dotenv\Dotenv::class)) {
        $dotenv = Dotenv\Dotenv::createImmutable($envRoot);
        // suppress re-loading errors if already loaded
        try {
            $dotenv->load();
        } catch (Throwable $e) { /* ignore */
        }
    }

    // 3) Read env vars (support both $_ENV and getenv)
    $DBHOST = $_ENV['DBHOST'] ?? getenv('DBHOST') ?: '127.0.0.1';
    $DBPORT = $_ENV['DBPORT'] ?? getenv('DBPORT') ?: '3306';
    $DBNAME = $_ENV['DBNAME'] ?? getenv('DBNAME') ?: '';
    $DBUSER = $_ENV['DBUSER'] ?? getenv('DBUSER') ?: '';
    $DBPASS = $_ENV['DBPASS'] ?? getenv('DBPASS') ?: '';

    if ($DBNAME === '' || $DBUSER === '') {
        throw new RuntimeException('Database environment variables missing: DBNAME and/or DBUSER are empty.');
    }

    $dsn = "mysql:host={$DBHOST};port={$DBPORT};dbname={$DBNAME};charset=utf8mb4";

    // 4) Create PDO once
    $pdo = new PDO($dsn, $DBUSER, $DBPASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    return $pdo;
}

/**
 * Optional: keep legacy $pdo for older includes that expect a global.
 * This runs only if the file is included directly and no $pdo exists yet.
 */
if (!isset($pdo) || !($pdo instanceof PDO)) {
    try {
        $pdo = db();
    } catch (Throwable $e) {
        // Keep the error visible during local dev; hide in production.
        exit("<pre style='color:red;'>❌ database.php failed: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . "</pre>");
    }
}
