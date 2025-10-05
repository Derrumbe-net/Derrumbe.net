<?php
require_once '../Controller/AdminController.php';
require_once '../Config/database.php';

header('Content-Type: application/json');

$conn = Database::getConnection();
$adminController = new AdminController($conn);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $adminController->handleGetRequest();
}

// TODO 
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $adminController->handlePostRequest();
// }
