<?php

declare(strict_types=1);

class ShopSettingModel
{
    public static function get(PDO $pdo, string $key): ?string
    {
        $sql = "
            SELECT setting_value
            FROM shop_settings
            WHERE setting_key = :key
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':key' => $key
        ]);

        $value = $stmt->fetchColumn();

        return $value === false ? null : (string)$value;
    }

    public static function set(PDO $pdo, string $key, string $value): void
    {
        $sql = "
            INSERT INTO shop_settings (setting_key, setting_value)
            VALUES (:key, :value)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':key'   => $key,
            ':value' => $value
        ]);
    }
}
