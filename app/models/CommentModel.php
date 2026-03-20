<?php

declare(strict_types=1);

class CommentModel
{
    /**
     * Create a new comment (pre-moderated; may be flagged as spam).
     * Returns the new comment_id.
     */
    public static function create(PDO $pdo, array $data): int
    {
        $sql = "
      INSERT INTO comments
        (content_type, content_id, parent_id, name, email, website, body, is_approved, is_spam, ip_address, user_agent)
      VALUES
        (:content_type, :content_id, :parent_id, :name, :email, :website, :body, :is_approved, :is_spam, :ip_address, :user_agent)
    ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':content_type' => $data['content_type'],
            ':content_id'   => (int)$data['content_id'],
            ':parent_id'    => $data['parent_id'] ?? null,
            ':name'         => $data['name'],
            ':email'        => $data['email'],
            ':website'      => $data['website'] ?? null,
            ':body'         => $data['body'],
            ':is_approved'  => (int)($data['is_approved'] ?? 0),
            ':is_spam'      => (int)($data['is_spam'] ?? 0),
            ':ip_address'   => $data['ip_address'] ?? null,
            ':user_agent'   => $data['user_agent'] ?? null,
        ]);

        return (int)$pdo->lastInsertId();
    }

    /**
     * List comments for a specific content scope.
     * $onlyApproved = true for public display.
     */
    public static function listByContent(PDO $pdo, string $contentType, int $contentId, int $offset = 0, int $limit = 10, bool $onlyApproved = true): array
    {
        $approveClause = $onlyApproved ? "AND is_approved = 1 AND is_spam = 0" : "";
        $sql = "
      SELECT comment_id, content_type, content_id, parent_id, name, email, website, body, is_approved, is_spam, ip_address, user_agent, created_at
      FROM comments
      WHERE content_type = :type
        AND content_id = :id
        $approveClause
      ORDER BY created_at ASC
      LIMIT :limit OFFSET :offset
    ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':type', $contentType, PDO::PARAM_STR);
        $stmt->bindValue(':id', $contentId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public static function countByContent(PDO $pdo, string $contentType, int $contentId, bool $onlyApproved = true): int
    {
        $approveClause = $onlyApproved ? "AND is_approved = 1 AND is_spam = 0" : "";
        $sql = "SELECT COUNT(*) FROM comments WHERE content_type = :type AND content_id = :id $approveClause";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':type' => $contentType, ':id' => $contentId]);
        return (int)$stmt->fetchColumn();
    }

    public static function approve(PDO $pdo, int $commentId): bool
    {
        $stmt = $pdo->prepare("UPDATE comments SET is_approved = 1 WHERE comment_id = :id");
        return $stmt->execute([':id' => $commentId]);
    }

    public static function delete(PDO $pdo, int $commentId): bool
    {
        $stmt = $pdo->prepare("DELETE FROM comments WHERE comment_id = :id");
        return $stmt->execute([':id' => $commentId]);
    }

    public static function markSpam(PDO $pdo, int $commentId): bool
    {
        $stmt = $pdo->prepare("UPDATE comments SET is_spam = 1 WHERE comment_id = :id");
        return $stmt->execute([':id' => $commentId]);
    }

    /**
     * Undo approve (set is_approved = 0).
     */
    public static function unapprove(PDO $pdo, int $commentId): bool
    {
        $stmt = $pdo->prepare("UPDATE comments SET is_approved = 0 WHERE comment_id = :id");
        return $stmt->execute([':id' => $commentId]);
    }

    /**
     * Undo spam (set is_spam = 0).
     */
    public static function unspam(PDO $pdo, int $commentId): bool
    {
        $stmt = $pdo->prepare("UPDATE comments SET is_spam = 0 WHERE comment_id = :id");
        return $stmt->execute([':id' => $commentId]);
    }

    /**
     * Admin listing by status: 'pending' | 'spam' | 'all'
     * Pending = not approved AND not spam.
     */
    public static function listByStatus(PDO $pdo, string $status, int $offset = 0, int $limit = 20): array
    {
        $where = "1=1";
        if ($status === 'pending') {
            $where = "is_approved = 0 AND is_spam = 0";
        } elseif ($status === 'spam') {
            $where = "is_spam = 1";
        }
        $sql = "
      SELECT comment_id, content_type, content_id, name, email, body, is_approved, is_spam, created_at
      FROM comments
      WHERE $where
      ORDER BY created_at DESC
      LIMIT :limit OFFSET :offset
    ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public static function countByStatus(PDO $pdo, string $status): int
    {
        $where = "1=1";
        if ($status === 'pending') {
            $where = "is_approved = 0 AND is_spam = 0";
        } elseif ($status === 'spam') {
            $where = "is_spam = 1";
        }
        $stmt = $pdo->query("SELECT COUNT(*) AS c FROM comments WHERE $where");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)($row['c'] ?? 0);
    }

    public static function countAll(PDO $pdo): int
    {
        $stmt = $pdo->query("SELECT COUNT(*) AS c FROM comments");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)($row['c'] ?? 0);
    }
}
