<?php
class Landslide {
    private $conn;

    public function __construct($conn) { $this->conn = $conn; }

    public function createLandslide($data) {
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO landslide (admin_id, landslide_date, latitude, longitude) 
                 VALUES (:admin_id, :landslide_date, :latitude, :longitude)"
            );
            $stmt->execute([
                ':admin_id'=>$data['admin_id'],
                ':landslide_date'=>$data['landslide_date'],
                ':latitude'=>$data['latitude'],
                ':longitude'=>$data['longitude']
            ]);
            return $this->conn->lastInsertId();
        } catch (PDOException $e) { error_log($e->getMessage()); return false; }
    }

    public function getLandslideById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM landslide WHERE landslide_id = :id");
        $stmt->execute([':id'=>$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllLandslides() {
        $stmt = $this->conn->query("SELECT * FROM landslide");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateLandslide($id, $data) {
        try {
            $stmt = $this->conn->prepare(
                "UPDATE landslide SET admin_id=:admin_id, landslide_date=:landslide_date,
                 latitude=:latitude, longitude=:longitude WHERE landslide_id=:id"
            );
            return $stmt->execute([
                ':admin_id'=>$data['admin_id'],
                ':landslide_date'=>$data['landslide_date'],
                ':latitude'=>$data['latitude'],
                ':longitude'=>$data['longitude'],
                ':id'=>$id
            ]);
        } catch (PDOException $e) { error_log($e->getMessage()); return false; }
    }

    public function deleteLandslide($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM landslide WHERE landslide_id=:id");
            return $stmt->execute([':id'=>$id]);
        } catch (PDOException $e) { error_log($e->getMessage()); return false; }
    }
}
