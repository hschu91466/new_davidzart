<?php

require_once __DIR__ . '/../services/ContactService.php';

class ContactController
{

    public function send(PDO $pdo, array $data)
    {


        if (
            empty($data['name']) ||
            empty($data['email']) ||
            empty($data['message'])
        ) {
            http_response_code(400);
            return [
                "success" => false,
                "message" => "All fields are required"
            ];
        }

        $service = new ContactService();
        return $service->sendMessage($pdo, $data);
    }

    public function index(): array
    {

        $service = new ContactService();
        return $service->getMessages();
    }


    public function markRead(PDO $pdo, array $data): array
    {
        $id = (int)$data['message_id'];

        $service = new ContactService();
        return $service->markRead($pdo, $id);
    }


    public function delete(PDO $pdo, array $data): array
    {
        $id = (int)$data['message_id'];

        $service = new ContactService();
        return $service->delete($pdo, $id);
    }
}
