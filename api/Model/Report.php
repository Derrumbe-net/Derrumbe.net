<?php
class Report {
    private $conn;
    public function __construct($conn){ $this->conn = $conn; }
    
    // CREATE REPORT
    public function createReport($data){
        try{
            $stmt = $this->conn->prepare(
                "INSERT INTO report
                (landslide_id, reported_at, description, city, image_url, latitude, longitude,
                 reporter_name, reporter_phone, reporter_email, physical_address)
                 VALUES
                (:landslide_id, :reported_at, :description, :city, :image_url, :latitude, :longitude,
                 :reporter_name, :reporter_phone, :reporter_email, :physical_address)"
            );
            $stmt->bindParam(':landslide_id', $data['landslide_id']);
            $stmt->bindParam(':reported_at', $data['reported_at']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':image_url', $data['image_url']);
            $stmt->bindParam(':latitude', $data['latitude']);
            $stmt->bindParam(':longitude', $data['longitude']);
            $stmt->bindParam(':reporter_name', $data['reporter_name']);
            $stmt->bindParam(':reporter_phone', $data['reporter_phone']);
            $stmt->bindParam(':reporter_email', $data['reporter_email']);
            $stmt->bindParam(':physical_address', $data['physical_address']);
            $stmt->execute();
            return $this->conn->lastInsertId();
        }catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }
    
    // GET REPORT BY ID
    public function getReportById($id){
        $stmt = $this->conn->prepare("SELECT * FROM report WHERE report_id=:id");
        $stmt->execute([':id'=>$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // GET ALL REPORTS
    public function getAllReports(){
        $stmt = $this->conn->query("SELECT * FROM report");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // UPDATE REPORT BY ID
    public function updateReport($id,$data){
        try{
            $stmt = $this->conn->prepare(
                "UPDATE report SET landslide_id=:landslide_id,reported_at=:reported_at,description=:description,
                 city=:city,image_url=:image_url,latitude=:latitude,longitude=:longitude,
                 reporter_name=:reporter_name,reporter_phone=:reporter_phone,reporter_email=:reporter_email,
                 physical_address=:physical_address WHERE report_id=:id"
            );
            $stmt->bindParam(':landslide_id', $data['landslide_id']);
            $stmt->bindParam(':reported_at', $data['reported_at']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':image_url', $data['image_url']);
            $stmt->bindParam(':latitude', $data['latitude']);
            $stmt->bindParam(':longitude', $data['longitude']);
            $stmt->bindParam(':reporter_name', $data['reporter_name']);
            $stmt->bindParam(':reporter_phone', $data['reporter_phone']);
            $stmt->bindParam(':reporter_email', $data['reporter_email']);
            $stmt->bindParam(':physical_address', $data['physical_address']);
            $stmt->bindParam(':id', $id);
            return $stmt->execute();
        }catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }
    
    // DELETE REPORT BY ID
    public function deleteReport($id){
        $stmt = $this->conn->prepare("DELETE FROM report WHERE report_id=:id");
        return $stmt->execute([':id'=>$id]);
    }
}
