-- Technical Service Management System Database Schema
-- Compatible with MySQL 5.7+ and PlanetScale

-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('OWNER', 'ADMINISTRATOR', 'EMPLOYEE') NOT NULL,
  branch_id VARCHAR(36),
  is_active BOOLEAN DEFAULT TRUE,
  last_access TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
);

-- Branches table
CREATE TABLE branches (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (is_active)
);

-- Tickets table
CREATE TABLE tickets (
  id VARCHAR(36) PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  house_reference VARCHAR(255),
  customer_id VARCHAR(255) NOT NULL,
  customer_tag VARCHAR(255) UNIQUE NOT NULL,
  problem_type ENUM(
    'Internet Reconnection', 
    'TV Reconnection', 
    'Service Cut', 
    'TV Maintenance', 
    'Internet Maintenance', 
    'New Installation',
    'Equipment Damage', 
    'Technical Support'
  ) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL,
  status ENUM('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED') DEFAULT 'PENDING',
  assigned_to VARCHAR(36),
  created_by VARCHAR(36) NOT NULL,
  started_at TIMESTAMP NULL,
  resolved_at TIMESTAMP NULL,
  resolution_notes TEXT,
  resolution_photos JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_created_by (created_by),
  INDEX idx_customer_tag (customer_tag),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
);

-- Inventory table
CREATE TABLE inventory (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM(
    'Router', 
    'Modem', 
    'Cable', 
    'Antenna', 
    'Switch', 
    'Connector', 
    'Splitter', 
    'Amplifier', 
    'Other'
  ) NOT NULL,
  serial_number VARCHAR(255),
  current_quantity INT NOT NULL DEFAULT 0,
  minimum_quantity INT NOT NULL DEFAULT 8,
  unit VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_quantity (current_quantity),
  INDEX idx_serial (serial_number),
  CHECK (current_quantity >= 0),
  CHECK (minimum_quantity >= 0)
);

-- GPS Locations table
CREATE TABLE gps_locations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy FLOAT,
  battery_level INT,
  speed FLOAT,
  is_active BOOLEAN DEFAULT TRUE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_active (is_active),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Alerts table
CREATE TABLE alerts (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM(
    'GPS_DISABLED', 
    'LOW_STOCK', 
    'URGENT_TICKET', 
    'OVERDUE_TICKET', 
    'TECHNICIAN_INACTIVE', 
    'CRITICAL'
  ) NOT NULL,
  severity ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  entity_id VARCHAR(36),
  entity_type VARCHAR(50),
  status ENUM('PENDING', 'REVIEWED', 'RESOLVED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  resolved_at TIMESTAMP NULL,
  reviewed_by VARCHAR(36),
  INDEX idx_type (type),
  INDEX idx_severity (severity),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Audit Log table
CREATE TABLE audit_log (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(36),
  details JSON,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_action_type (action_type),
  INDEX idx_entity_type (entity_type),
  INDEX idx_timestamp (timestamp),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- Refresh Tokens table (for JWT management)
CREATE TABLE refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default data
INSERT INTO branches (id, name, address, phone) VALUES 
('branch-1', 'Oficina Principal', 'Av. Principal 123, Ciudad', '+1234567890');

-- Insert default users (password: admin123)
INSERT INTO users (id, email, password_hash, full_name, role, branch_id) VALUES 
('user-owner', 'owner@sistema.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.HL9ykO', 'Propietario Sistema', 'OWNER', 'branch-1'),
('user-admin', 'admin@sistema.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.HL9ykO', 'Administrador Principal', 'ADMINISTRATOR', 'branch-1'),
('user-employee', 'tecnico@sistema.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.HL9ykO', 'Técnico de Campo', 'EMPLOYEE', 'branch-1');

-- Insert sample inventory
INSERT INTO inventory (id, name, type, current_quantity, minimum_quantity, unit, location) VALUES 
('inv-1', 'Router TP-Link AC1200', 'Router', 15, 5, 'unidad', 'Almacén Principal'),
('inv-2', 'Modem DOCSIS 3.0', 'Modem', 8, 8, 'unidad', 'Almacén Principal'),
('inv-3', 'Cable Coaxial RG6', 'Cable', 500, 100, 'metro', 'Almacén Principal'),
('inv-4', 'Antena WiFi 2.4GHz', 'Antenna', 3, 5, 'unidad', 'Almacén Principal'),
('inv-5', 'Splitter 2 vías', 'Splitter', 25, 10, 'unidad', 'Almacén Principal');

-- Insert sample tickets
INSERT INTO tickets (id, ticket_number, customer_name, address, house_reference, customer_id, customer_tag, problem_type, description, priority, status, created_by) VALUES 
('ticket-1', 'TKT-001', 'Juan Pérez', 'Calle 123 #45-67', 'Casa azul con portón blanco', '12345678', 'CUST-001', 'Internet Reconnection', 'Cliente reporta que no tiene servicio de internet desde ayer', 'HIGH', 'PENDING', 'user-admin'),
('ticket-2', 'TKT-002', 'María García', 'Carrera 89 #12-34', 'Edificio verde, apto 301', '87654321', 'CUST-002', 'TV Maintenance', 'Problemas con la señal de televisión, se ve pixelada', 'MEDIUM', 'PENDING', 'user-admin');