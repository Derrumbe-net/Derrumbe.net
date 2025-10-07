<?php
require_once __DIR__ . '/../Config/database.php';

class Admin {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn; // PDO connection
    }

    // CREATE
    public function createReport($reported_at, $description, $city, $image_url, $latitude, $longitude, $reporter_name, $reporter_phone, $reporter_email, $physical_address) {
        try {
            $stmt = $this->conn->prepare("INSERT INTO report (reported_at, description, city, image_url, latitude, longitude, reporter_name, reporter_phone, reporter_phone, reporter_email, physical_address) VALUES (:reported_at, :description, :city, :image_url, :latitude, :longitude, :reporter_name, :reporter_phone, :reporter_phone, :reporter_email, :physical_address)");

            $stmt->bindParam(':reported_at', $reporter_at, PDO::PARAM_STR);
        
            if ($stmt->execute()) {
                return $this->conn->lastInsertId(); // Return new admin ID
            }
            return false;
        } catch (PDOException $e) {
            error_log("Create Admin Error: " . $e->getMessage());
            return false;
        }
    }
}
