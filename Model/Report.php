<?php
class Report {
    private $conn;
    public function __construct($conn){ $this->conn = $conn; }

    public function createReport($data){
        try{
            $stmt = $this->conn->prepare(
                "INSERT INTO report
                (landslide_id, reported_at, description, city, image_url, latitude, longitude,
                 reporter_name, reporter_phone, reporter_email, physical_address)
                 VALUES
                (:landslide_id,:reported_at,:description,:city,:image_url,:latitude,:longitude,
                 :reporter_name,:reporter_phone,:reporter_email,:physical_address)"
            );
            $stmt->execute([
                ':landslide_id'=>$data['landslide_id'],
                ':reported_at'=>$data['reported_at'] ?? null,
                ':description'=>$data['description'] ?? null,
                ':city'=>$data['city'] ?? null,
                ':image_url'=>$data['image_url'] ?? null,
                ':latitude'=>$data['latitude'] ?? null,
                ':longitude'=>$data['longitude'] ?? null,
                ':reporter_name'=>$data['reporter_name'] ?? null,
                ':reporter_phone'=>$data['reporter_phone'] ?? null,
                ':reporter_email'=>$data['reporter_email'] ?? null,
                ':physical_address'=>$data['physical_address'] ?? null
            ]);
            return $this->conn->lastInsertId();
        }catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }

    public function getReportById($id){
        $stmt = $this->conn->prepare("SELECT * FROM report WHERE report_id=:id");
        $stmt->execute([':id'=>$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllReports(){
        $stmt = $this->conn->query("SELECT * FROM report");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateReport($id,$data){
        try{
            $stmt = $this->conn->prepare(
                "UPDATE report SET landslide_id=:landslide_id,reported_at=:reported_at,description=:description,
                 city=:city,image_url=:image_url,latitude=:latitude,longitude=:longitude,
                 reporter_name=:reporter_name,reporter_phone=:reporter_phone,reporter_email=:reporter_email,
                 physical_address=:physical_address WHERE report_id=:id"
            );
            return $stmt->execute([
                ':landslide_id'=>$data['landslide_id'],
                ':reported_at'=>$data['reported_at'] ?? null,
                ':description'=>$data['description'] ?? null,
                ':city'=>$data['city'] ?? null,
                ':image_url'=>$data['image_url'] ?? null,
                ':latitude'=>$data['latitude'] ?? null,
                ':longitude'=>$data['longitude'] ?? null,
                ':reporter_name'=>$data['reporter_name'] ?? null,
                ':reporter_phone'=>$data['reporter_phone'] ?? null,
                ':reporter_email'=>$data['reporter_email'] ?? null,
                ':physical_address'=>$data['physical_address'] ?? null,
                ':id'=>$id
            ]);
        }catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }

    public function deleteReport($id){
        $stmt = $this->conn->prepare("DELETE FROM report WHERE report_id=:id");
        return $stmt->execute([':id'=>$id]);
    }
}
