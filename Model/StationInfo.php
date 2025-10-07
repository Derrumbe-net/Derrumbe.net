<?php
class StationInfo {
    private $conn;
    public function __construct($conn){ $this->conn = $conn; }

    public function createStationInfo($data){
        try{
            $stmt = $this->conn->prepare(
                "INSERT INTO station_info
                (admin_id, soil_saturation, precipitation, sensor_image_url, data_image_url, city,
                 is_available, last_updated, latitude, longitude)
                 VALUES
                (:admin_id,:soil_saturation,:precipitation,:sensor_image_url,:data_image_url,:city,
                 :is_available,:last_updated,:latitude,:longitude)"
            );
            $stmt->execute([
                ':admin_id'=>$data['admin_id'],
                ':soil_saturation'=>$data['soil_saturation'],
                ':precipitation'=>$data['precipitation'] ?? null,
                ':sensor_image_url'=>$data['sensor_image_url'] ?? null,
                ':data_image_url'=>$data['data_image_url'] ?? null,
                ':city'=>$data['city'] ?? null,
                ':is_available'=>$data['is_available'] ?? 0,
                ':last_updated'=>$data['last_updated'] ?? null,
                ':latitude'=>$data['latitude'] ?? null,
                ':longitude'=>$data['longitude'] ?? null
            ]);
            return $this->conn->lastInsertId();
        }catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }

    public function getStationInfoById($id){
        $stmt=$this->conn->prepare("SELECT * FROM station_info WHERE station_id=:id");
        $stmt->execute([':id'=>$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAllStationInfos(){
        $stmt=$this->conn->query("SELECT * FROM station_info");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStationInfo($id,$data){
        try{
            $stmt=$this->conn->prepare(
                "UPDATE station_info SET admin_id=:admin_id,soil_saturation=:soil_saturation,
                 precipitation=:precipitation,sensor_image_url=:sensor_image_url,data_image_url=:data_image_url,
                 city=:city,is_available=:is_available,last_updated=:last_updated,
                 latitude=:latitude,longitude=:longitude WHERE station_id=:id"
            );
            return $stmt->execute([
                ':admin_id'=>$data['admin_id'],
                ':soil_saturation'=>$data['soil_saturation'],
                ':precipitation'=>$data['precipitation'] ?? null,
                ':sensor_image_url'=>$data['sensor_image_url'] ?? null,
                ':data_image_url'=>$data['data_image_url'] ?? null,
                ':city'=>$data['city'] ?? null,
                ':is_available'=>$data['is_available'] ?? 0,
                ':last_updated'=>$data['last_updated'] ?? null,
                ':latitude'=>$data['latitude'] ?? null,
                ':longitude'=>$data['longitude'] ?? null,
                ':id'=>$id
            ]);
        }catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }

    public function deleteStationInfo($id){
        $stmt=$this->conn->prepare("DELETE FROM station_info WHERE station_id=:id");
        return $stmt->execute([':id'=>$id]);
    }
}
