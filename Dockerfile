# Stage 1 — build the React app
FROM node:22-alpine AS build

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
FROM nginx:alpine AS serve

# Copy the static build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (SPA routing + compression + caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
