# syntax=docker/dockerfile:1

# Tahap 1: build SPA (Vite 8 butuh Node >= 20.19 / 22.12).
FROM node:22-alpine AS build
WORKDIR /app

# Harus sama dengan ADMIN_PATH backend (lihat config/security.php).
ARG VITE_ADMIN_PATH=/digfin-secure-panel
ENV VITE_ADMIN_PATH=$VITE_ADMIN_PATH

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Tahap 2: nginx menyajikan hasil build sekaligus jadi edge/reverse-proxy
# ke php-fpm (service `app`) untuk /api, /sanctum, dan /storage.
FROM nginx:1.27-alpine AS web

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
