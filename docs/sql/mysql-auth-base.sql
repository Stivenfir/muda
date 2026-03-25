-- Esquema base para identidad corporativa en MySQL 8+
-- Login gestionado directamente desde PR_EMPLEADO (sin tabla pr_usuario_login)

CREATE DATABASE IF NOT EXISTS abcmudanzas CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE abcmudanzas;

CREATE TABLE IF NOT EXISTS pr_persona (
  persona_id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_documento VARCHAR(20) NOT NULL,
  numero_documento VARCHAR(30) NOT NULL,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  correo_electronico VARCHAR(120) NULL,
  telefono VARCHAR(30) NULL,
  esta_activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_pr_persona_numero_documento (numero_documento)
);

CREATE TABLE IF NOT EXISTS pr_empleado (
  empleado_id INT AUTO_INCREMENT PRIMARY KEY,
  persona_id INT NOT NULL,
  codigo_empleado VARCHAR(30) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  area VARCHAR(100) NOT NULL,
  nombre_usuario VARCHAR(80) NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  esta_activo TINYINT(1) NOT NULL DEFAULT 1,
  estado_empleado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  fecha_ingreso DATE NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_pr_empleado_persona (persona_id),
  UNIQUE KEY uk_pr_empleado_codigo (codigo_empleado),
  UNIQUE KEY uk_pr_empleado_usuario (nombre_usuario),
  CONSTRAINT fk_pr_empleado_persona FOREIGN KEY (persona_id) REFERENCES pr_persona(persona_id)
);

CREATE TABLE IF NOT EXISTS pr_rol (
  rol_id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_rol VARCHAR(40) NOT NULL,
  nombre_rol VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NULL,
  esta_activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_pr_rol_codigo (codigo_rol)
);

CREATE TABLE IF NOT EXISTS pr_empleado_rol (
  empleado_rol_id INT AUTO_INCREMENT PRIMARY KEY,
  empleado_id INT NOT NULL,
  rol_id INT NOT NULL,
  esta_activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_pr_empleado_rol_unique (empleado_id, rol_id),
  CONSTRAINT fk_pr_empleado_rol_empleado FOREIGN KEY (empleado_id) REFERENCES pr_empleado(empleado_id),
  CONSTRAINT fk_pr_empleado_rol_rol FOREIGN KEY (rol_id) REFERENCES pr_rol(rol_id)
);

-- Carga de roles sugeridos
INSERT INTO pr_rol (codigo_rol, nombre_rol, descripcion)
VALUES
  ('ADMIN', 'Administrador', 'Acceso administrativo temporal'),
  ('CLIENTE', 'Cliente', 'Usuario externo con visibilidad de su caso'),
  ('COMERCIAL', 'Comercial mudanzas', 'Gestión comercial y oportunidad'),
  ('PRICING', 'Pricing', 'Validación de tarifas y costos'),
  ('EJECUTIVO_CUENTA', 'Ejecutivo de cuenta movilidad', 'Control E2E de la operación'),
  ('FINANCIERO', 'Financiero', 'Pagos, cobros y validaciones de cartera'),
  ('GERENTE', 'Gerente de mudanzas', 'Supervisión gerencial'),
  ('DIRECTOR', 'Director de movilidad global', 'Supervisión ejecutiva global')
ON DUPLICATE KEY UPDATE nombre_rol = VALUES(nombre_rol), descripcion = VALUES(descripcion);

-- Usuario administrador inicial
-- password original: Admin123*
INSERT INTO pr_persona (tipo_documento, numero_documento, nombres, apellidos, correo_electronico)
VALUES ('CC', '0000000001', 'Admin', 'Sistema', 'admin@abcmudanzas.local')
ON DUPLICATE KEY UPDATE correo_electronico = VALUES(correo_electronico);

INSERT INTO pr_empleado (
  persona_id,
  codigo_empleado,
  cargo,
  area,
  nombre_usuario,
  contrasena_hash,
  esta_activo,
  estado_empleado,
  fecha_ingreso
)
SELECT
  p.persona_id,
  'EMP-0001',
  'Administrador',
  'TI',
  'admin',
  '$2b$10$Em4JAkPPk3okkuXlHcVAauOUGxy5wHLLxcADdB7hy7njsfqT8bThe',
  1,
  'ACTIVO',
  CURRENT_DATE
FROM pr_persona p
WHERE p.numero_documento = '0000000001'
ON DUPLICATE KEY UPDATE
  contrasena_hash = VALUES(contrasena_hash),
  esta_activo = VALUES(esta_activo),
  estado_empleado = VALUES(estado_empleado);

INSERT INTO pr_empleado_rol (empleado_id, rol_id, esta_activo)
SELECT e.empleado_id, r.rol_id, 1
FROM pr_empleado e
JOIN pr_rol r ON r.codigo_rol = 'ADMIN'
WHERE e.nombre_usuario = 'admin'
ON DUPLICATE KEY UPDATE esta_activo = VALUES(esta_activo);
