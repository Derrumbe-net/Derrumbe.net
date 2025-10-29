<?php

namespace DerrumbeNet\Controller;

use DerrumbeNet\Model\Admin;

require_once __DIR__ . '/../Model/Admin.php';
class AdminController {
    private $adminModel;

    public function __construct($db) {
        $this->adminModel = new Admin($db);
    }

    private function jsonResponse($response, $data, $status = 200) {
        $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    // Create a new admin
    public function createAdmin($request, $response) {
        $data = $request->getParsedBody();
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return $this->jsonResponse($response, ['error' => 'Email and Password are required'], 400);
        }

        $newId = $this->adminModel->createAdmin($email, $password);
        if ($newId) {
            return $this->jsonResponse($response, ['message' => 'Admin created', 'id' => $newId], 201);
        }

        return $this->jsonResponse($response, ['error' => 'Failed to create admin'], 500);
    }

    // Get admin by ID
    public function getAdmin($request, $response, $args) {
        $id = $args['id'];
        $admin = $this->adminModel->getAdminById($id);

        if ($admin) {
            return $this->jsonResponse($response, $admin);
        }

        return $this->jsonResponse($response, ['error' => 'Admin not found'], 404);
    }

    // Get all admins
    public function getAllAdmins($request, $response) {
        $admins = $this->adminModel->getAllAdmins();
        return $this->jsonResponse($response, $admins);
    }

    // Update admin email
    public function updateEmail($request, $response, $args) {
        $id = $args['id'];
        $data = $request->getParsedBody();
        $email = $data['email'] ?? null;

        if (!$email) {
            return $this->jsonResponse($response, ['error' => 'Email is required'], 400);
        }

        $updated = $this->adminModel->updateEmail($id, $email);
        if ($updated) {
            return $this->jsonResponse($response, ['message' => 'Email updated']);
        }

        return $this->jsonResponse($response, ['error' => 'Failed to update email'], 500);
    }

    // Update admin password
    public function updatePassword($request, $response, $args) {
        $id = $args['id'];
        $data = $request->getParsedBody();
        $password = $data['password'] ?? null;

        if (!$password) {
            return $this->jsonResponse($response, ['error' => 'Password is required'], 400);
        }

        $updated = $this->adminModel->updatePassword($id, $password);
        if ($updated) {
            return $this->jsonResponse($response, ['message' => 'Password updated']);
        }

        return $this->jsonResponse($response, ['error' => 'Failed to update password'], 500);
    }

    // Delete admin
    public function deleteAdmin($request, $response, $args) {
        $id = $args['id'];
        $deleted = $this->adminModel->deleteAdminById($id);

        if ($deleted) {
            return $this->jsonResponse($response, ['message' => 'Admin deleted']);
        }

        return $this->jsonResponse($response, ['error' => 'Failed to delete admin'], 500);
    }
}
