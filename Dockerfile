# Usar la imagen oficial de Node.js
FROM node:18-alpine AS base

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el código fuente
COPY . .

# Configurar variables de entorno para el build
ARG JWT_SECRET
ARG DATABASE_URL
ARG NODE_ENV=production
ARG POSTGRES_DB
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ENV JWT_SECRET=$JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV POSTGRES_DB=$POSTGRES_DB
ENV POSTGRES_USER=$POSTGRES_USER
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV NODE_ENV=$NODE_ENV

# Construir la aplicación
RUN npm run build

# Imagen de producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Copiar archivos necesarios desde la imagen base
COPY --from=base /app/public ./public
COPY --from=base /app/package*.json ./
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Generar el cliente de Prisma en producción
RUN npx prisma generate

# Cambiar propietario de los archivos
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 