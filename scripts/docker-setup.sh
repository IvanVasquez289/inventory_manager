#!/bin/bash

export NODE_ENV=production

mkdir -p uploads

echo "🧹 Limpiando contenedores anteriores..."
docker-compose down -v 2>/dev/null || true

docker rmi inventory_app 2>/dev/null || true

echo "🔨 Construyendo contenedores..."
docker-compose build --no-cache

echo "🚀 Iniciando servicios..."
docker-compose up -d

echo "⏳ Esperando a que los servicios estén listos..."
sleep 15

echo "🔍 Verificando servicios..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Servicios iniciados correctamente"
    echo "🌐 Aplicación disponible en: http://localhost:3000"
    echo "🗄️  Base de datos PostgreSQL en: localhost:5432"
else
    echo "❌ Error al iniciar los servicios"
    echo "📋 Logs de los servicios:"
    docker-compose logs --tail=50
    exit 1
fi
