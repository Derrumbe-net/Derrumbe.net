<?php
require_once '../Model/Admin.php';
require_once '../Config/database.php';

header('Content-Type: application/json');

$conn = Database::getConnection();
$adminModel = new Admin($conn);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $admin = $adminModel->getAdminById($_GET['id']);
        echo json_encode($admin);
    } else {
        $admins = $adminModel->getAllAdmins();
        echo json_encode($admins);
    }
}

