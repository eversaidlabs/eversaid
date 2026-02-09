#!/bin/sh
# Log build-time configuration on container start

echo "=========================================="
echo "Frontend Container Starting"
echo "=========================================="
echo "Build-time config (baked into bundle):"
echo "  NEXT_PUBLIC_API_URL:            ${NEXT_PUBLIC_API_URL:-<empty, using relative URLs>}"
if [ -n "$NEXT_PUBLIC_TURNSTILE_SITE_KEY" ]; then
  echo "  NEXT_PUBLIC_TURNSTILE_SITE_KEY: <set>"
else
  echo "  NEXT_PUBLIC_TURNSTILE_SITE_KEY: <not set>"
fi
echo ""
echo "Runtime config:"
echo "  NODE_ENV:                       ${NODE_ENV}"
echo "  HOSTNAME:                       ${HOSTNAME}"
echo "  PORT:                           ${PORT}"
echo "=========================================="

exec node server.js
