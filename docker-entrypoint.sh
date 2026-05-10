#!/bin/sh
set -e

: "${PORT:=8080}"
export PORT

# Substitute $PORT into the Nginx server block at startup.
envsubst '${PORT}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
