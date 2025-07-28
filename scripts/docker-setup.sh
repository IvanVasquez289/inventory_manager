#!/bin/bash

# Script para configurar y ejecutar la aplicación con Docker

# Asegurar que NODE_ENV tenga un valor estándar
export NODE_ENV=production

# Crear directorio de uploads si no existe
mkdir -p uploads

# Limpiar contenedores anteriores si existen
echo "🧹 Limpiando contenedores anteriores..."
docker-compose down -v 2>/dev/null || true

# Construir y ejecutar los contenedores
echo "🔨 Construyendo contenedores..."
docker-compose build --no-cache

echo "🚀 Iniciando servicios..."
docker-compose up -d

echo "⏳ Esperando a que los servicios estén listos..."
sleep 15

# Verificar que los servicios estén funcionando
echo "🔍 Verificando servicios..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Servicios iniciados correctamente"
    echo "🌐 Aplicación disponible en: http://localhost:3000"
    echo "🗄️  Base de datos PostgreSQL en: localhost:5432"
    
    # Ejecutar migraciones
    echo "🗄️  Ejecutando migraciones de la base de datos..."
    docker-compose exec app npx prisma migrate deploy 2>/dev/null || echo "⚠️  No hay migraciones para ejecutar"
    
else
    echo "❌ Error al iniciar los servicios"
    echo "📋 Logs de los servicios:"
    docker-compose logs --tail=50
    exit 1
fi

echo "🎉 ¡Setup completado!"
echo ""
echo "Comandos útiles:"
echo "  docker-compose up -d          # Iniciar servicios"
echo "  docker-compose down           # Detener servicios"
echo "  docker-compose logs -f        # Ver logs en tiempo real"
echo "  docker-compose restart        # Reiniciar servicios"
echo "  docker-compose exec app sh    # Acceder al contenedor de la app"
echo "  docker-compose exec postgres psql -U postgres -d prueba_tecnica  # Acceder a la BD" 