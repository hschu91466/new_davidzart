<?php

class QuoteModel
{
    /**
     * Get all active quotes, ordered for display.
     */
    public static function getActive(PDO $pdo): array
    {
        $sql = "
            SELECT quote_id, text, author, sort_order
            FROM quotes
            WHERE is_active = 1
            ORDER BY sort_order ASC, quote_id ASC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get a single random active quote (for a rotating home-page quote).
     */
    public static function getRandom(PDO $pdo): mixed
    {
        $sql = "
            SELECT quote_id, text, author
            FROM quotes
            WHERE is_active = 1
            ORDER BY RAND()
            LIMIT 1
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Get all quotes, including inactive ones — for the admin list view.
     */
    public static function getAll(PDO $pdo): array
    {
        $sql = "
            SELECT quote_id, text, author, sort_order, is_active, created_at
            FROM quotes
            ORDER BY sort_order ASC, quote_id ASC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getById(PDO $pdo, int $quoteId): mixed
    {
        $sql = "
            SELECT quote_id, text, author, sort_order, is_active, created_at
            FROM quotes
            WHERE quote_id = :id
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $quoteId]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function create(PDO $pdo, array $data): int
    {
        $sql = "
            INSERT INTO quotes (text, author, sort_order, is_active)
            VALUES (:text, :author, :sort_order, :is_active)
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':text'       => $data['text'],
            ':author'     => $data['author'] ?? null,
            ':sort_order' => $data['sort_order'] ?? 0,
            ':is_active'  => $data['is_active'] ?? 1,
        ]);

        return (int)$pdo->lastInsertId();
    }

    public static function update(PDO $pdo, array $data): bool
    {
        $sql = "
            UPDATE quotes
            SET text = :text,
                author = :author,
                sort_order = :sort_order,
                is_active = :is_active
            WHERE quote_id = :id
        ";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([
            ':id'         => $data['quote_id'],
            ':text'       => $data['text'],
            ':author'     => $data['author'] ?? null,
            ':sort_order' => $data['sort_order'] ?? 0,
            ':is_active'  => $data['is_active'] ?? 1,
        ]);
    }

    public static function delete(PDO $pdo, int $quoteId): bool
    {
        $sql = "DELETE FROM quotes WHERE quote_id = :id";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute([':id' => $quoteId]);
    }
}
