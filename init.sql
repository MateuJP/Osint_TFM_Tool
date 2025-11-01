-- Tabla CONFIGURACION
CREATE TABLE configuracion (
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    apikey VARCHAR(255),
    modo VARCHAR(50)
);

-- Tabla GENERO
CREATE TABLE genero (
    id_genero SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla ESTADO
CREATE TABLE estado (
    id_estado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla SITUACION_SENTIMENTAL
CREATE TABLE situacion_sentimental (
    id_situacion_sentimental SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla ORIENTACION_SEXUAL
CREATE TABLE orientacion_sexual (
    id_orientacion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla ORIENTACION_POLITICA
CREATE TABLE orientacion_politica (
    id_orientacion_politica SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla Nacionalidad
CREATE TABLE nacionalidad (
    id_nacionalidad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(10) UNIQUE NOT NULL
);
-- Tabla Nacionalidad
CREATE TABLE pais (
    id_pais SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(10) UNIQUE NOT NULL
);
-- Tabla IDENTIDAD
CREATE TABLE identidad (
    id_identidad SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    edad INT,
    fecha_nacimiento DATE,
    profesion VARCHAR(100),
    nivel_educativo VARCHAR(100),
    nombre_padre VARCHAR(100),
    nombre_madre VARCHAR(100),
    numero_hermanos INT,
    bibliografia TEXT,
    observaciones TEXT,
    avatar VARCHAR(255),
    id_genero INT REFERENCES genero(id_genero),
    id_estado INT REFERENCES estado(id_estado),
    id_situacion_sentimental INT REFERENCES situacion_sentimental(id_situacion_sentimental),
    id_orientacion_sexual INT REFERENCES orientacion_sexual(id_orientacion),
    id_orientacion_politica INT REFERENCES orientacion_politica(id_orientacion_politica),
    id_nacionalidad INT REFERENCES nacionalidad(id_nacionalidad),
    id_pais_residencia INT REFERENCES pais(id_pais)
);

-- Tabla AFICIONES
CREATE TABLE aficion (
    id_aficion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla IDENTIDAD_AFICIONES (relación N a N)
CREATE TABLE identidad_aficiones (
    id_identidad INT REFERENCES identidad(id_identidad) ON DELETE CASCADE,
    id_aficion INT REFERENCES aficion(id_aficion) ON DELETE CASCADE,
    observaciones TEXT,
    PRIMARY KEY (id_identidad, id_aficion)
);

-- Tabla RED_SOCIAL
CREATE TABLE red_social (
    id_red_social SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    logo VARCHAR(255)
);

-- Tabla CUENTA
CREATE TABLE cuenta (
    id_cuenta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(255),
    credenciales TEXT,
    fecha DATE,
    url VARCHAR(255),
    id_identidad INT REFERENCES identidad(id_identidad),
    id_red_social INT REFERENCES red_social(id_red_social)
);

-- Tabla ACCION
CREATE TABLE accion (
    id_accion SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notas TEXT,
    observaciones TEXT,
    url VARCHAR(255),
    resumen TEXT,
    id_identidad INT REFERENCES identidad(id_identidad),
    id_cuenta INT REFERENCES cuenta(id_cuenta)
);

-- Tabla MUESTRAS_GRAFICAS
CREATE TABLE muestras_graficas (
    id_muestra SERIAL PRIMARY KEY,
    titulo VARCHAR(255),
    url VARCHAR(255),
    formato VARCHAR(50),
    id_accion INT REFERENCES accion(id_accion)
);
