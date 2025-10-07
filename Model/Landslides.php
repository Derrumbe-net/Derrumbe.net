<?php
require_once __DIR__ . '/../Config/database.php';

class Landslides {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // CREATE
    public function createLandslide($date, $lat, $lon) {
        try {
            $stmt = $this->conn->prepare("INSERT INTO lanslide (landslide_date, latitude, longitude) VALUES (:landslide_date, :latitude, :longitude)");
            $stmt->bindParam(':landslide_date', $date, PDO::PARAM_STR);
            $stmt->bindParam(':latitude', $lat, PDO::PARAM_STR);
            $stmt->bindParam(':longitude', $lon, PDO::PARAM_STR);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("Create Landslide Error: " . $e->getMessage());
            return false;
        }
    }

    // READ
    public function getLandslideByID($id) {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM landslide WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get Landslide by ID Error: " . $e->getMessage());
            return false;
        }
    }

    // TODO READ by YEAR


    // TODO READ by LOCATION
    

    public function getAllLandslides() {
        try {
            $stmt = $this->conn->query("SELECT * FROM landslide");
            return $stmt-> fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get All Landslides Error: " . $e->getMessage());
            return [];
        }
    }

    // DELETE BY ID
    public function deleteLandslideById($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM landslide WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execture();
        } catch (PDOException $e) {
            error_log("Delete Landslide by ID Error: " . $e->getMessage());
            return false;
        }
    }
}
