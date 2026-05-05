<?php

namespace DerrumbeNet\Model;

use PDO;
use PDOException;

class LandslideReadyMunicipality
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getAll()
{
    $stmt = $this->conn->query("SELECT * FROM landslideready_municipalities ORDER BY name ASC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    public function getById($id)
    {
        $stmt = $this->conn->prepare(
            "SELECT * FROM landslideready_municipalities WHERE id = :id"
        );
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        try {
            $stmt = $this->conn->prepare(
                "INSERT INTO landslideready_municipalities (name, stage)
                 VALUES (:name, :stage)"
            );
            $stmt->bindParam(':name',  $data['name'],  PDO::PARAM_STR);
            $stmt->bindParam(':stage', $data['stage'], PDO::PARAM_STR);

            if ($stmt->execute()) {
                return $this->conn->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return false;
        }
    }

    public function update($id, $data)
    {
        try {
            $allowed = ['name', 'stage'];
            $setClauses = [];
            $params = [':id' => $id];

            foreach ($allowed as $col) {
                if (array_key_exists($col, $data)) {
                    $setClauses[] = "$col = :$col";
                    $params[":$col"] = $data[$col];
                }
            }
            if (empty($setClauses)) return true;

            $sql  = "UPDATE landslideready_municipalities SET "
                  . implode(', ', $setClauses)
                  . " WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute($params);
        } catch (PDOException $e) {
            error_log($e->getMessage());
            return false;
        }
    }

    public function delete($id)
    {
        $stmt = $this->conn->prepare(
            "DELETE FROM landslideready_municipalities WHERE id = :id"
        );
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}