<?php
require_once __DIR__ . '/../Model/Publication.php';

class PublicationController {
    private $publicationModel;
    public function __construct($db) { $this->publicationModel = new Publication($db); }

    private function jsonResponse($response, $data, $status = 200) {
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    public function createPublication($request, $response) {
        $data = $request->getParsedBody();
        $id = $this->publicationModel->createPublication($data);
        if ($id) return $this->jsonResponse($response, ['message'=>'Publication created','id'=>$id], 201);
        return $this->jsonResponse($response, ['error'=>'Failed'], 500);
    }

    public function getAllPublications($request, $response) {
        return $this->jsonResponse($response, $this->publicationModel->getAllPublications());
    }

    public function getPublication($request, $response, $args) {
        $pub = $this->publicationModel->getPublicationById($args['id']);
        if ($pub) return $this->jsonResponse($response, $pub);
        return $this->jsonResponse($response, ['error'=>'Not found'], 404);
    }

    public function updatePublication($request, $response, $args) {
        $updated = $this->publicationModel->updatePublication($args['id'], $request->getParsedBody());
        if ($updated) return $this->jsonResponse($response, ['message'=>'Updated']);
        return $this->jsonResponse($response, ['error'=>'Failed'], 500);
    }

    public function deletePublication($request, $response, $args) {
        $deleted = $this->publicationModel->deletePublication($args['id']);
        if ($deleted) return $this->jsonResponse($response, ['message'=>'Deleted']);
        return $this->jsonResponse($response, ['error'=>'Failed'], 500);
    }
}
