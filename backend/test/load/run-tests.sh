#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3001}"
DURATION="${DURATION:-60}"
CONNECTIONS="${CONNECTIONS:-50}"
PIPELINING="${PIPELINING:-10}"

echo "=== EduSocial Load Test Suite ==="
echo "Target: $BASE_URL"
echo ""

echo "--- Smoke Test (10c, 30s) ---"
npx autocannon -c 10 -d 30 "$BASE_URL/health" 2>&1 || true
echo ""

echo "--- Baseline Test ($CONNECTIONS c, ${DURATION}s) ---"
npx autocannon -c "$CONNECTIONS" -d "$DURATION" -p "$PIPELINING" "$BASE_URL/health" 2>&1 || true
echo ""

echo "--- API Endpoint Test ---"
npx autocannon -c 20 -d 30 -p 5 "$BASE_URL/api/v1/posts" 2>&1 || true
echo ""

echo "--- Stress Test (200c, 60s) ---"
npx autocannon -c 200 -d 60 -p 20 "$BASE_URL/health" 2>&1 || true
echo ""

echo "--- Spike Test (500c, 15s) ---"
npx autocannon -c 500 -d 15 -p 50 "$BASE_URL/health" 2>&1 || true
echo ""

echo "=== Load Test Complete ==="
