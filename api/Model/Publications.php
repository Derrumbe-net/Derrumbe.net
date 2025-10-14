<?php 
require_once __DIR__ . '/../Config/database.php';

class Publications {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    // CREATE
    public function createPublicatio($title, $publication_url, $image_url, $description) {
        try {
            $stmt = $this->conn->prepare("INSERT INTO publication (title, publication_url, image_url, description) VALUES (:title, :publication_url, :image_url, :description)");
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':publication_url', $publication_url, PDO::PARAM_STR);
            $stmt->bindParam(':image_url', $image_url, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("Create Admin Error: " . $e->getMessage());
            return false;
        }
    }

    // TODO READ by ID
    
    // TODO READ All
    
    // TODO UPDATE by ID
    
    // TODO DELETE by ID
}
