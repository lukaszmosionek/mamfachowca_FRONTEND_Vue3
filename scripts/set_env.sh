#!/bin/bash
# Generates .env.production from all _ENV_* secrets

OUTPUT_FILE=".env.production"
echo "# Auto-generated .env.production" > "$OUTPUT_FILE"

# Loop through all environment variables
for var in $(compgen -e); do
  if [[ $var == _ENV_* ]]; then
    # Convert _ENV_* → VITE_*
    key="VITE_${var#_ENV_}"
    value="${!var}"
    echo "$key=$value" >> "$OUTPUT_FILE"
    echo "Set $key"
  fi
done