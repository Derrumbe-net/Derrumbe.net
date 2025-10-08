<?php
require_once __DIR__ . '/../Config/database.php';

class Projects {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // CREATE
    public function createProject($title, $start_year, $end_year, $project_status, $description, $image_url) {
        try {
            $stmt = $this->conn->prepare("INSERT INTO project (title, start_year, end_year, project_status, description, image_url) VALUES (:title, :start_year, :end_year, :project_status, :description, :image_url)");

            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':start_year', $start_year, PDO::PARAM_INT);
            $stmt->bindParam(':end_year', $end_year, PDO::PARAM_INT);
            $stmt->bindParam(':project_status', $project_status, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':image_url', $image_url, PDO::PARAM_STR);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("Create Project Error: " . $e->getMessage());
            return false;
        }
    }
    
    // TODO READ by ID
    
    // TODO READ by PROJECT_STATUS
    
    // TODO UPDATE by ID
    
    // TODO DELETE by ID
}
