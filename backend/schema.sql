-- Task-Flow MySQL Database Initialization Script
-- Table: tasks matching Section 4 assignment specification

CREATE DATABASE IF NOT EXISTS task_flow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE task_flow_db;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample starter tasks for verification
INSERT INTO tasks (title, description, status, created_at, updated_at)
VALUES 
  ('Review Architecture & Database Schema', 'Check relational constraints and SQLAlchemy models for Task-Flow', 'completed', NOW(), NOW()),
  ('Implement React Frontend UI', 'Build responsive interface with filter tabs, modals, and pure custom CSS', 'completed', NOW(), NOW()),
  ('Run Pytest Backend Suite', 'Verify 200, 201, 400 validation, 404 not found status codes', 'completed', NOW(), NOW()),
  ('Prepare Documentation & Video Walkthrough', 'Ensure README enables review setup in under 10 minutes', 'pending', NOW(), NOW());
