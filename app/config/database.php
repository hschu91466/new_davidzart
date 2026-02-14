
<?php

require __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$DBHOST = $_ENV['DBHOST'];
$DBPORT = $_ENV['DBPORT'];
$DBNAME = $_ENV['DBNAME'];
$DBUSER = $_ENV['DBUSER'];
$DBPASS = $_ENV['DBPASS'];

$dsn = "mysql:host={$DBHOST};port={$DBPORT};dbname={$DBNAME};charset=utf8mb4";


try {
    $pdo = new PDO($dsn, $DBUSER, $DBPASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
    // echo "<pre>✅ database.php connected</pre>";
} catch (PDOException $e) {
    exit("<pre style='color:red;'>❌ database.php failed: {$e->getMessage()}</pre>");
}
