<?php

namespace DerrumbeNet\Controller;

require_once __DIR__ . '/../Model/Project.php';

class ProjectController {
    private $projectModel;
    public function __construct($db) { $this->projectModel = new Project($db); }

    private function jsonResponse($response, $data, $status=200) {
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
        $response->getBody()->write($payload);
        return $response->withHeader('Content-Type','application/json')->withStatus($status);
    }

    public function createProject($request,$response){
        $id = $this->projectModel->createProject($request->getParsedBody());
        return $id ? $this->jsonResponse($response,['message'=>'Project created','id'=>$id],201)
                   : $this->jsonResponse($response,['error'=>'Failed'],500);
    }

    public function getAllProjects($request,$response){ 
        return $this->jsonResponse($response,$this->projectModel->getAllProjects());
    }

    public function getProject($request,$response,$args){
        $proj = $this->projectModel->getProjectById($args['id']);
        return $proj ? $this->jsonResponse($response,$proj)
                     : $this->jsonResponse($response,['error'=>'Not found'],404);
    }

    public function updateProject($request,$response,$args){
        $updated = $this->projectModel->updateProject($args['id'],$request->getParsedBody());
        return $updated ? $this->jsonResponse($response,['message'=>'Updated'])
                        : $this->jsonResponse($response,['error'=>'Failed'],500);
    }

    public function deleteProject($request,$response,$args){
        $deleted = $this->projectModel->deleteProject($args['id']);
        return $deleted ? $this->jsonResponse($response,['message'=>'Deleted'])
                        : $this->jsonResponse($response,['error'=>'Failed'],500);
    }
}
