# ========================================
# DOCKERFILE MULTI-STAGE PARA PORTFOLIO
# ========================================
# Optimizado para producción con mejores prácticas

# ========================================
# STAGE 1: BASE IMAGE CON DEPENDENCIAS
# ========================================
FROM node:18-alpine AS base

# Metadatos del contenedor
LABEL maintainer="tu.email@ejemplo.com"
LABEL description="Portfolio Backend API con Node.js y Express"
LABEL version="1.0.0"

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S portfolio -u 1001

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY server/package*.json ./

# Instalar dependencias con optimizaciones
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# ========================================
# STAGE 2: DEVELOPMENT ENVIRONMENT
# ========================================
FROM base AS development

# Instalar dependencias de desarrollo
RUN npm ci

# Copiar código fuente
COPY server/ ./

# Exponer puerto
EXPOSE 3000

# Usar nodemon para desarrollo
CMD ["npm", "run", "dev"]

# ========================================
# STAGE 3: TESTING ENVIRONMENT
# ========================================
FROM base AS testing

# Instalar todas las dependencias (incluyendo dev)
RUN npm ci

# Copiar código fuente
COPY server/ ./

# Ejecutar tests
RUN npm run test

# ========================================
# STAGE 4: PRODUCTION BUILD
# ========================================
FROM base AS builder

# Instalar dependencias de build
RUN npm ci

# Copiar código fuente
COPY server/ ./

# Ejecutar build si es necesario
RUN npm run build || true

# ========================================
# STAGE 5: PRODUCTION RUNTIME
# ========================================
FROM node:18-alpine AS production

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S portfolio -u 1001

# Configurar directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción desde stage base
COPY --from=base --chown=portfolio:nodejs /app/node_modules ./node_modules

# Copiar archivos de la aplicación
COPY --chown=portfolio:nodejs server/package*.json ./
COPY --chown=portfolio:nodejs server/app.js ./
COPY --chown=portfolio:nodejs server/routes/ ./routes/
COPY --chown=portfolio:nodejs server/middleware/ ./middleware/ 2>/dev/null || true
COPY --chown=portfolio:nodejs server/utils/ ./utils/ 2>/dev/null || true

# Copiar archivos estáticos del frontend
COPY --chown=portfolio:nodejs src/ ./public/

# Crear directorio para datos
RUN mkdir -p /app/data && \
    chown -R portfolio:nodejs /app/data

# Cambiar a usuario no-root
USER portfolio

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Exponer puerto
EXPOSE 3000

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto
CMD ["node", "app.js"]

# ========================================
# STAGE 6: NGINX REVERSE PROXY (OPCIONAL)
# ========================================
FROM nginx:alpine AS nginx

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos estáticos
COPY --from=production /app/public /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# ========================================
# CONFIGURACIÓN DE BUILD TARGETS
# ========================================
# Para construir diferentes targets:
# 
# Desarrollo:
# docker build --target development -t portfolio-dev .
# 
# Testing:
# docker build --target testing -t portfolio-test .
# 
# Producción (por defecto):
# docker build -t portfolio-prod .
# 
# Con Nginx:
# docker build --target nginx -t portfolio-nginx .