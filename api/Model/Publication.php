<?php
class Publication {
    private $conn;
    public function __construct($conn) { $this->conn = $conn; }

    // CREATE PUBLICATION
    // TODO use bind param
    public function createPublication($data) {
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO publication (admin_id, title, publication_url, image_url, description)
                 VALUES (:admin_id, :title, :publication_url, :image_url, :description)"
            );
            $stmt->execute([
                ':admin_id'=>$data['admin_id'],
                ':title'=>$data['title'],
                ':publication_url'=>$data['publication_url'],
                ':image_url'=>$data['image_url'] ?? null,
                ':description'=>$data['description'] ?? null
            ]);
            return $this->conn->lastInsertId();
        } catch(PDOException $e) { error_log($e->getMessage()); return false; }
    }
    
    // GET PUBLICATION BY ID
    public function getPublicationById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM publication WHERE publication_id=:id");
        $stmt->execute([':id'=>$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // GET ALL PUBLICATIONS
    public function getAllPublications() {
        $stmt = $this->conn->query("SELECT * FROM publication");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // UPDATE PUBLICATION
    public function updatePublication($id, $data) {
        try {
            $stmt = $this->conn->prepare(
                "UPDATE publication SET admin_id=:admin_id, title=:title, publication_url=:publication_url,
                 image_url=:image_url, description=:description WHERE publication_id=:id"
            );
            return $stmt->execute([
                ':admin_id'=>$data['admin_id'],
                ':title'=>$data['title'],
                ':publication_url'=>$data['publication_url'],
                ':image_url'=>$data['image_url'] ?? null,
                ':description'=>$data['description'] ?? null,
                ':id'=>$id
            ]);
        } catch(PDOException $e) { error_log($e->getMessage()); return false; }
    }
    
    // DELETE PUBLICATION BY ID
    public function deletePublication($id) {
        $stmt = $this->conn->prepare("DELETE FROM publication WHERE publication_id=:id");
        return $stmt->execute([':id'=>$id]);
    }
}
