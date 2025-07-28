-- Script de inicialización de la base de datos
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear la base de datos si no existe
SELECT 'CREATE DATABASE prueba_tecnica'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'prueba_tecnica')\gexec

-- Conectar a la base de datos
\c prueba_tecnica;
