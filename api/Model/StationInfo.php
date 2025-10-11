<?php
class StationInfo {
    private $conn;
    public function __construct($conn){ $this->conn = $conn; }
    
    // CREATE STATION INFO
    public function createStationInfo($data){
        try{
            $stmt = $this->conn->prepare(
                "INSERT INTO station_info
                (admin_id, soil_saturation, precipitation, sensor_image_url, data_image_url, city,
                 is_available, last_updated, latitude, longitude)
                 VALUES
                (:admin_id, :soil_saturation, :precipitation, :sensor_image_url, :data_image_url, :city,
                 :is_available, :last_updated, :latitude, :longitude)"
            );
            $stmt->bindParam(':admin_id', $data['admin_id'], PDO::PARAM_INT);
            $stmt->bindParam(':soil_saturation', $data['soil_saturation'], PDO::PARAM_STR);
            $stmt->bindParam(':precipitation', $data['precipitation'], PDO::PARAM_STR);
            $stmt->bindParam(':sensor_image_url', $data['sensor_image_url'], PDO::PARAM_STR);
            $stmt->bindParam(':data_image_url', $data['data_image_url'], PDO::PARAM_STR);
            $stmt->bindParam(':city', $data['city'], PDO::PARAM_STR);
            $stmt->bindParam(':is_available', $data['is_available'], PDO::PARAM_BOOL);
            $stmt->bindParam(':last_updated', $data['last_updated'], PDO::PARAM_STR);
            $stmt->bindParam(':latitude', $data['latitude'], PDO::PARAM_STR);
            $stmt->bindParam(':longitude', $data['longitude'], PDO::PARAM_STR);
            $stmt->execute();
            return $this->conn->lastInsertId();
        }catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }
    
    // GET STATION INFO BY ID
    public function getStationInfoById($id){
        $stmt=$this->conn->prepare("SELECT * FROM station_info WHERE station_id=:id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // GET ALL STATIONS INFO
    public function getAllStationInfos(){
        $stmt=$this->conn->query("SELECT * FROM station_info");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // UPDATE STATION INFO BY ID
    public function updateStationInfo($id,$data){
        try{
            $stmt=$this->conn->prepare(
                "UPDATE station_info SET admin_id=:admin_id,soil_saturation=:soil_saturation,
                 precipitation=:precipitation,sensor_image_url=:sensor_image_url,data_image_url=:data_image_url,
                 city=:city,is_available=:is_available,last_updated=:last_updated,
                 latitude=:latitude,longitude=:longitude WHERE station_id=:id"
            );
            $stmt->bindParam(':admin_id', $data['admin_id'], PDO::PARAM_INT);
            $stmt->bindParam(':soil_saturation', $data['soil_saturation'], PDO::PARAM_STR);
            $stmt->bindParam(':precipitation', $data['precipitation'], PDO::PARAM_STR);
            $stmt->bindParam(':sensor_image_url', $data['sensor_image_url'], PDO::PARAM_STR);
            $stmt->bindParam(':data_image_url', $data['data_image_url'], PDO::PARAM_STR);
            $stmt->bindParam(':city', $data['city'], PDO::PARAM_STR);
            $stmt->bindParam(':is_available', $data['is_available'], PDO::PARAM_BOOL);
            $stmt->bindParam(':last_updated', $data['last_updated'], PDO::PARAM_STR);
            $stmt->bindParam(':latitude', $data['latitude'], PDO::PARAM_STR);
            $stmt->bindParam(':longitude', $data['longitude'], PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        }catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }
    
    // DELETE STATION BY ID
    public function deleteStationInfo($id){
        $stmt=$this->conn->prepare("DELETE FROM station_info WHERE station_id=:id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
