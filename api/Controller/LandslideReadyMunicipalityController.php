<?php

namespace DerrumbeNet\Controller;

use DerrumbeNet\Model\LandslideReadyMunicipality;

class LandslideReadyMunicipalityController
{
    private LandslideReadyMunicipality $model;

    public function __construct(LandslideReadyMunicipality $model)
    {
        $this->model = $model;
    }

    private function jsonResponse($response, $data, $status = 200)
    {
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    // GET /landslideready-municipalities
    public function getAll($request, $response)
    {
        return $this->jsonResponse($response, $this->model->getAll());
    }

    // GET /landslideready-municipalities/{id}
    public function getOne($request, $response, $args)
    {
        $item = $this->model->getById($args['id']);
        if ($item) return $this->jsonResponse($response, $item);
        return $this->jsonResponse($response, ['error' => 'Not found'], 404);
    }

    // POST /landslideready-municipalities
    public function create($request, $response)
    {
        $data = $request->getParsedBody();
        if (empty($data['name']) || empty($data['stage'])) {
            return $this->jsonResponse($response, ['error' => 'name and stage are required'], 400);
        }
        $id = $this->model->create($data);
        if ($id) return $this->jsonResponse($response, ['message' => 'Created', 'id' => $id], 201);
        return $this->jsonResponse($response, ['error' => 'Failed to create'], 500);
    }

    // PUT /landslideready-municipalities/{id}
    public function update($request, $response, $args)
    {
        $data = $request->getParsedBody();
        if (empty($data) || !is_array($data)) {
            return $this->jsonResponse($response, ['error' => 'No data provided'], 400);
        }
        $updated = $this->model->update($args['id'], $data);
        if ($updated) return $this->jsonResponse($response, ['message' => 'Updated successfully']);
        return $this->jsonResponse($response, ['error' => 'Failed to update'], 500);
    }

    // DELETE /landslideready-municipalities/{id}
    public function delete($request, $response, $args)
    {
        $deleted = $this->model->delete($args['id']);
        if ($deleted) return $this->jsonResponse($response, ['message' => 'Deleted']);
        return $this->jsonResponse($response, ['error' => 'Failed to delete'], 500);
    }
}