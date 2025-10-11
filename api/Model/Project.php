<?php
class Project {
    private $conn;
    public function __construct($conn){ $this->conn = $conn; }

    // CREATE PROJECT
    // TODO Modify to use bind param
    public function createProject($data){
        try{
            $stmt = $this->conn->prepare(
                "INSERT INTO project (admin_id, title, start_year, end_year, project_status, description, image_url)
                 VALUES (:admin_id,:title,:start_year,:end_year,:project_status,:description,:image_url)"
            );
            $stmt->execute([
                ':admin_id'=>$data['admin_id'],
                ':title'=>$data['title'],
                ':start_year'=>$data['start_year'] ?? null,
                ':end_year'=>$data['end_year'] ?? null,
                ':project_status'=>$data['project_status'] ?? null,
                ':description'=>$data['description'] ?? null,
                ':image_url'=>$data['image_url'] ?? null
            ]);
            return $this->conn->lastInsertId();
        } catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }
    
    // GET PROJECT ID
    public function getProjectById($id){
        $stmt=$this->conn->prepare("SELECT * FROM project WHERE project_id=:id");
        $stmt->execute([':id'=>$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // GET PROJECT BY STATUS
    // TODO 

    // GET ALL PROJECT
    public function getAllProjects(){
        $stmt = $this->conn->query("SELECT * FROM project");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // UPDATE PROJECT BY ID
    public function updateProject($id,$data){
        try{
            $stmt = $this->conn->prepare(
                "UPDATE project SET admin_id=:admin_id,title=:title,start_year=:start_year,
                 end_year=:end_year,project_status=:project_status,description=:description,image_url=:image_url
                 WHERE project_id=:id"
            );
            return $stmt->execute([
                ':admin_id'=>$data['admin_id'],
                ':title'=>$data['title'],
                ':start_year'=>$data['start_year'] ?? null,
                ':end_year'=>$data['end_year'] ?? null,
                ':project_status'=>$data['project_status'] ?? null,
                ':description'=>$data['description'] ?? null,
                ':image_url'=>$data['image_url'] ?? null,
                ':id'=>$id
            ]);
        } catch(PDOException $e){ error_log($e->getMessage()); return false; }
    }
    
    // DELETE PROJECT BY ID
    public function deleteProject($id){
        $stmt=$this->conn->prepare("DELETE FROM project WHERE project_id=:id");
        return $stmt->execute([':id'=>$id]);
    }
}
