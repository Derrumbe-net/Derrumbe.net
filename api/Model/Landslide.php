<?php
class Landslide {
    private $conn;

    public function __construct($conn) { $this->conn = $conn; }

    // CREATE LANDSLIDE
    public function createLandslide($data) {
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO landslide (admin_id, landslide_date, latitude, longitude) 
                 VALUES (:admin_id, :landslide_date, :latitude, :longitude)"
            );

            $stmt->bindParam(':admin_id', $data['admin_id'], PDO::PARAM_INT);
            $stmt->bindParam(':landslide_date', $data['landslide_date'], PDO::PARAM_STR);
            $stmt->bindParam(':latitude', $data['latitude'], PDO::PARAM_STR);
            $stmt->bindParam(':longitude', $data['longitude'], PDO::PARAM_STR);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
            return false;

        } catch (PDOException $e) {
            error_log("Create Landslide Error: " .$e->getMessage());
            return false;
        }
    }
    
    // GET LANSLIDE BY ID
    public function getLandslideById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM landslide WHERE landslide_id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // GET ALL LANDSLIDES
    public function getAllLandslides() {
        $stmt = $this->conn->query("SELECT * FROM landslide");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // UPDATE LANDSLIDE BY ID
    public function updateLandslide($id, $data) {
        try {
            $stmt = $this->conn->prepare(
                "UPDATE landslide SET admin_id=:admin_id, landslide_date=:landslide_date,
                 latitude=:latitude, longitude=:longitude WHERE landslide_id=:id"
            );

            $stmt->bindParam(':admin_id', $data['admin_id'], PDO::PARAM_INT);
            $stmt->bindParam(':landslide_date', $data['landslide_date'], PDO::PARAM_STR);
            $stmt->bindParam(':latitude', $data['latitude'], PDO::PARAM_STR);
            $stmt->bindParam(':longitude', $data['longitude'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) { error_log($e->getMessage()); return false; }
    }
    
    // DELETE LANSLIDE BY ID
    public function deleteLandslide($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM landslide WHERE landslide_id=:id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        } catch (PDOException $e) { error_log($e->getMessage()); return false; }
    }
}
