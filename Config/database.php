<?php
class Database {
    private static $conn;

    public static function getConnection() {
        if (!self::$conn) {
            require __DIR__ . '/../vendor/autoload.php';
            $dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
            $dotenv->load();

            $servername = $_ENV['DB_HOST'];
            $username   = $_ENV['DB_USER'];
            $password   = $_ENV['DB_PASSWORD'];
            $dbname     = $_ENV['DB_NAME'];

            self::$conn = new mysqli($servername, $username, $password, $dbname);

            if (self::$conn->connect_error) {
                http_response_code(500);
                die(json_encode(["error" => "DB connection failed: " . self::$conn->connect_error]));
            }
        }
        return self::$conn;
    }
}

