#!/bin/bash

# Apply Supabase schema via REST API
SUPABASE_URL="https://rgyksenggjxamrfddvlm.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJneWtzZW5nZ2p4YW1yZmRkdmxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTExNDQ1MCwiZXhwIjoyMDg2NjkwNDUwfQ.SkvA0nVda4t666IAhq5JkJH9fQAETA4-8l6S298NvWA"

# Read the SQL file
SQL_CONTENT=$(cat supabase/migrations/20260215000000_initial_schema.sql)

# Apply via Supabase SQL endpoint
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/query" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL_CONTENT" | jq -Rs .)}"
