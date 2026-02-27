# Stage 1 — build the React app
FROM node:24-alpine@sha256:7fddd9ddeae8196abf4a3ef2de34e11f7b1a722119f91f28ddf1e99dcafdf114 AS build

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci

# Build argument for the services password — never stored in the repo
ARG VITE_SERVICES_PASSWORD
ENV VITE_SERVICES_PASSWORD=$VITE_SERVICES_PASSWORD

# Copy source files needed for the build
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:alpine@sha256:1d13701a5f9f3fb01aaa88cef2344d65b6b5bf6b7d9fa4cf0dca557a8d7702ba AS serve

# Copy the static build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (SPA routing + compression + caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
