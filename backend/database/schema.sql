-- Project: Derrumbes Centralized Web Platform
-- Schema Version: 1.0
-- Created: 2025-10-02

-- -- START CLEAN (optional)
-- DROP DATABASE IF EXISTS capstone_db;
-- CREATE DATABASE capstone_db; 
-- USE capstone_db;

-- 1 -> Admin
CREATE TABLE admin (
  admin_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- 2 -> Landslide
CREATE TABLE landslide (
  landslide_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  landslide_date DATETIME NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

-- 3 -> Publication
CREATE TABLE publication (
  publication_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  publication_url VARCHAR(512) NOT NULL,
  image_url VARCHAR(512) NULL,
  description TEXT NULL,
  FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

-- 4 -> Project
CREATE TABLE project (
  project_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  start_year SMALLINT UNSIGNED NULL,
  end_year SMALLINT UNSIGNED NULL,
  project_status ENUM('planned','active','paused','completed','archived') NULL,
  description TEXT NULL,
  image_url VARCHAR(512) NULL,
  FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

-- 5 -> Station_Info
CREATE TABLE station_info (
  station_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  soil_saturation INT UNSIGNED NOT NULL,      
  precipitation DECIMAL(6,2) NULL,            
  sensor_image_url VARCHAR(512) NULL,
  data_image_url VARCHAR(512) NULL,
  city VARCHAR(100) NULL,
  is_available TINYINT(1) NOT NULL DEFAULT 0,
  last_updated DATETIME NULL,
  latitude DECIMAL(9,6) NULL,
  longitude DECIMAL(9,6) NULL,
  FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

-- 6 -> Report
CREATE TABLE report (
  report_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  landslide_id INT NOT NULL,
  reported_at DATETIME NULL,
  description TEXT NULL,
  city VARCHAR(100) NULL,
  image_url VARCHAR(512) NULL,
  latitude DECIMAL(9,6) NULL,
  longitude DECIMAL(9,6) NULL,
  reporter_name VARCHAR(100) NULL,
  reporter_phone VARCHAR(30) NULL,
  reporter_email VARCHAR(255) NULL,
  physical_address VARCHAR(255) NULL,
  KEY idx_report_landslide (landslide_id),
  FOREIGN KEY (landslide_id) REFERENCES landslide(landslide_id)
  ON UPDATE CASCADE ON DELETE CASCADE
);
