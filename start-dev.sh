#!/bin/bash

# Start DevProfile Hub development servers

echo "🚀 Starting DevProfile Hub Development Servers..."

# Start backend
(
  cd server || exit 1
  echo "📡 Starting backend server..."
  npm start &
  BACKEND_PID=$!
  sleep 2
)

# Start frontend
(
  cd client || exit 1
  echo "🎨 Starting frontend server..."
  npm start &
  FRONTEND_PID=$!
  sleep 2
)

echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080"
echo "Press Ctrl+C to stop both servers"

# Wait for both to exit
wait 