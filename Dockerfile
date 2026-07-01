# Stage 1 — build the React app
FROM node:24-alpine@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS build

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
FROM nginx:alpine@sha256:54f2a904c251d5a34adf545a72d32515a15e08418dae0266e23be2e18c66fefa AS serve

# Copy the static build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (SPA routing + compression + caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
