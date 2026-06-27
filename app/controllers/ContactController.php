<?php

require_once __DIR__ . '/../services/ContactService.php';

class ContactController
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    } 

    public function send(array $data)
    {
        if (
            empty($data['name']) ||
            empty($data['email']) ||
            empty($data['message'])
        ) {
            return [
                "success" => false,
                "message" => "All fields are required"
            ];
        }

        $service = new ContactService();
        return $service->sendMessage($this->pdo, $data);
    }

    public function index(): array
    {
        $service = new ContactService();
        return $service->getMessages();
    }

    public function markRead(array $data): array
    {
        $id = (int)$data['message_id'];

        $service = new ContactService();
        return $service->markRead($this->pdo, $id);
    }

    public function delete(array $data): array
    {
        $id = (int)$data['message_id'];

        $service = new ContactService();
        return $service->delete($this->pdo, $id);
    }
}
