#!/bin/bash

# Vegamailer Startup Script for Hostinger
# This script starts the API and PocketBase services

echo "Starting Vegamailer services..."

# Set Node.js version (ensure Hostinger Node.js Selector is set to 20.x)
export NODE_VERSION=20.19.1

# Start PocketBase in background
echo "Starting PocketBase..."
cd apps/pocketbase
./pocketbase serve --http=127.0.0.1:8090 &
POCKETBASE_PID=$!
echo "PocketBase started with PID: $POCKETBASE_PID"
cd ../..

# Wait for PocketBase to be ready
sleep 3

# Start API server
echo "Starting API server..."
cd apps/api
node src/main.js &
API_PID=$!
echo "API server started with PID: $API_PID"
cd ../..

# Save PIDs for later shutdown
echo $POCKETBASE_PID > .pocketbase.pid
echo $API_PID > .api.pid

echo "All services started successfully!"
echo "PocketBase: http://127.0.0.1:8090"
echo "API: http://127.0.0.1:3001"
