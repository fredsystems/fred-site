# Stage 1 — build the React app
FROM node:24-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS build

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
FROM nginx:alpine@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752 AS serve

# Copy the static build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (SPA routing + compression + caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
