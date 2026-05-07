#!/bin/bash

# Vegamailer Stop Script for Hostinger

echo "Stopping Vegamailer services..."

# Stop API
if [ -f .api.pid ]; then
    API_PID=$(cat .api.pid)
    kill $API_PID 2>/dev/null
    rm .api.pid
    echo "API server stopped (PID: $API_PID)"
fi

# Stop PocketBase
if [ -f .pocketbase.pid ]; then
    POCKETBASE_PID=$(cat .pocketbase.pid)
    kill $POCKETBASE_PID 2>/dev/null
    rm .pocketbase.pid
    echo "PocketBase stopped (PID: $POCKETBASE_PID)"
fi

echo "All services stopped."
