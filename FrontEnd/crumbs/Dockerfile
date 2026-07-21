# ============================================================
# Crumbs Frontend - Dockerfile Multi-stage
# ============================================================
# USO:
#   Desarrollo: docker compose up (con hot-reload)
#   Producción: docker build --target production -t crumbs-frontend .
# ============================================================

# --- Stage 1: Base con dependencias ---
FROM node:22-alpine AS deps

WORKDIR /app

# Copiar solo archivos de dependencias para cachear la capa
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# --- Stage 2: Desarrollo (con hot-reload) ---
FROM node:22-alpine AS development

WORKDIR /app

# Copiar dependencias del stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Puerto del dev server
EXPOSE 4200

# Servir con hot-reload accesible desde fuera del container
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]

# --- Stage 3: Build de producción ---
FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx ng build --configuration=production

# --- Stage 4: Servidor de producción con Nginx ---
FROM nginx:alpine AS production

# Copiar config personalizada de Nginx (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build de Angular
COPY --from=build /app/dist/crumbs/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
