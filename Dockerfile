# --- Stage 1: build the static assets ---
FROM node:20-alpine AS build
WORKDIR /app

# Install deps with a clean install for reproducibility.
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build

# --- Stage 2: serve via Nginx ---
FROM nginx:alpine AS runtime

# Use a writable directory for runtime config substitution.
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint-atlantic.sh
RUN chmod +x /docker-entrypoint-atlantic.sh

# Replace the default Nginx config so only ours runs.
RUN rm -f /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run sets PORT, default to 8080 for local runs.
ENV PORT=8080
EXPOSE 8080

# Allow non-root user to bind to non-privileged port (8080 already non-privileged)
# and write to the conf.d directory at startup.
RUN chown -R nginx:nginx /etc/nginx/conf.d /var/cache/nginx /var/log/nginx /usr/share/nginx/html \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid
USER nginx

ENTRYPOINT ["/docker-entrypoint-atlantic.sh"]
