<?php
require_once __DIR__ . '/../Model/Admin.php';

class AdminController {
    private $adminModel;

    public function __construct($conn) {
        $this->adminModel = new Admin($conn);
    }

    public function handleGetRequest() {
        if (isset($_GET['id'])) {
            $admin = $this->adminModel->getAdminById($_GET['id']);
            echo json_encode($admin);
        } else {
            $admins = $this->adminModel->getAllAdmins();
            echo json_encode($admins);
        }
    }

    // TODO POST, PUT, DELETE requests here
    // public function handlePostRequest() { ... }
    // public function handlePutRequest() { ... }
    // public function handleDeleteRequest() { ... }
}
