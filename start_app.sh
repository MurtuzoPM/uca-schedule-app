#!/bin/bash

# Function to kill all background processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
}
trap cleanup EXIT

echo "Starting UCA Schedule App..."

# Start Backend
echo "Starting Backend (Spring Boot)..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to initialize (optional, but good for logs)
sleep 5

# Start Frontend
echo "Starting Frontend (React)..."
cd frontend
npm run dev

# Wait for backend process
wait $BACKEND_PID
