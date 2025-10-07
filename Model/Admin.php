<?php
require_once __DIR__ . '/../Config/database.php';

class Admin {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn; // PDO connection
    }

    // CREATE
    public function createAdmin($name, $email) {
        try {
            $stmt = $this->conn->prepare("INSERT INTO admin (name, email) VALUES (:name, :email)");
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId(); // Return new admin ID
            }
            return false;
        } catch (PDOException $e) {
            error_log("Create Admin Error: " . $e->getMessage());
            return false;
        }
    }

    // READ BY ID
    public function getAdminById($id) {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM admin WHERE admin_id = :admin_id");
            $stmt->bindParam(':admin_id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get Admin by ID Error: " . $e->getMessage());
            return false;
        }
    }

    // READ ALL
    public function getAllAdmins() {
        try {
            $stmt = $this->conn->query("SELECT * FROM admin");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get All Admins Error: " . $e->getMessage());
            return [];
        }
    }

    // GET EMAIL BY ID
    public function getEmailById($id) {
        try {
            $stmt = $this->conn->prepare("SELECT email FROM admin WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get Email by ID Error: " . $e->getMessage());
            return false;
        }
    }

        // GET PASSWORD BY ID
    public function getPasswordById($id) {
        try {
            $stmt = $this->conn->prepare("SELECT password FROM admin WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Get Password by ID Error: " . $e->getMessage());
            return false;
        }
    }

    // UPDATE EMAIL
    public function updateEmail($id, $email) {
        try {
            $stmt = $this->conn->prepare("UPDATE admin SET email = :email WHERE id = :id");
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Update Email Error: " . $e->getMessage());
            return false;
        }
    }

    // UPDATE PASSWORD
    public function updatePassword($id, $password) {
        try {
            $stmt = $this->conn->prepare("UPDATE admin SET password = :password WHERE id = :id");
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Update Password Error: " . $e->getMessage());
            return false;
        }
    }

    // DELETE BY ID
    public function deleteAdminById($id) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM admin WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Delete Admin by ID Error: " . $e->getMessage());
            return false;
        }
    }
}

