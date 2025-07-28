FROM node:22-alpine AS base

RUN npm install -g npm@latest

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

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

RUN npm run build:docker

FROM node:22-alpine AS runner

RUN npm install -g npm@latest

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN apk add --no-cache libc6-compat openssl

# Copiar archivos necesarios desde la imagen base
COPY --from=base /app/public ./public
COPY --from=base /app/package*.json ./
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/scripts ./scripts

# Instalar solo dependencias de producción y generar Prisma UNA SOLA VEZ
RUN npm ci --only=production && \
    npx prisma generate && \
    npm cache clean --force && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Inicializar base de datos y luego iniciar la aplicación
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && exec node server.js"]
