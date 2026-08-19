<?php

declare(strict_types=1);

require_once __DIR__ . '/../models/QuoteModel.php';

class QuoteController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Public: active quotes for display (e.g. home page rotation).
     */
    public function quotes(): array
    {
        try {
            $quotes = QuoteModel::getActive($this->pdo);
            return ['quotes' => $quotes];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Public: single random quote.
     */
    public function random(): array
    {
        try {
            $quote = QuoteModel::getRandom($this->pdo);
            return ['quote' => $quote];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Admin: full list including inactive quotes.
     */
    public function listAdmin(): array
    {
        try {
            $quotes = QuoteModel::getAll($this->pdo);
            return ['quotes' => $quotes];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function create(array $data): array
    {
        $text = trim($data['text'] ?? '');

        if ($text === '') {
            return ['success' => false, 'message' => 'Quote text is required'];
        }

        try {
            $id = QuoteModel::create($this->pdo, $data);
            return ['success' => true, 'quote_id' => $id];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function update(array $data): array
    {
        $id = $data['quote_id'] ?? null;
        $text = trim($data['text'] ?? '');

        if (!$id || $text === '') {
            return ['success' => false, 'message' => 'Invalid request'];
        }

        try {
            QuoteModel::update($this->pdo, $data);
            return ['success' => true];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function delete(array $data): array
    {
        $id = $data['quote_id'] ?? null;

        if (!$id) {
            return ['success' => false, 'message' => 'Invalid request'];
        }

        try {
            QuoteModel::delete($this->pdo, (int)$id);
            return ['success' => true];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
