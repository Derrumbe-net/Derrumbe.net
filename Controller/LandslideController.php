<?php
require_once __DIR__ . '/../Model/Landslide.php';

class LandslideController {
    private $landslideModel;

    public function __construct($db) {
        $this->landslideModel = new Landslide($db);
    }

    private function jsonResponse($response, $data, $status = 200) {
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    public function createLandslide($request, $response) {
        $data = $request->getParsedBody();
        $newId = $this->landslideModel->createLandslide($data);
        if ($newId) return $this->jsonResponse($response, ['message'=>'Landslide created','id'=>$newId], 201);
        return $this->jsonResponse($response, ['error'=>'Failed to create'], 500);
    }

    public function getAllLandslides($request, $response) {
        $lands = $this->landslideModel->getAllLandslides();
        return $this->jsonResponse($response, $lands);
    }

    public function getLandslide($request, $response, $args) {
        $land = $this->landslideModel->getLandslideById($args['id']);
        if ($land) return $this->jsonResponse($response, $land);
        return $this->jsonResponse($response, ['error'=>'Not found'], 404);
    }

    public function updateLandslide($request, $response, $args) {
        $data = $request->getParsedBody();
        $updated = $this->landslideModel->updateLandslide($args['id'], $data);
        if ($updated) return $this->jsonResponse($response, ['message'=>'Updated']);
        return $this->jsonResponse($response, ['error'=>'Failed'], 500);
    }

    public function deleteLandslide($request, $response, $args) {
        $deleted = $this->landslideModel->deleteLandslide($args['id']);
        if ($deleted) return $this->jsonResponse($response, ['message'=>'Deleted']);
        return $this->jsonResponse($response, ['error'=>'Failed'], 500);
    }
}
