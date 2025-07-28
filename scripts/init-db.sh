#!/bin/bash

echo "🗄️  Inicializando base de datos..."

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que PostgreSQL esté listo..."
until npx prisma db push --accept-data-loss; do
  echo "⏳ Base de datos no está lista, esperando..."
  sleep 2
done

echo "✅ Base de datos inicializada correctamente"
echo "🚀 Aplicación lista para recibir conexiones"
