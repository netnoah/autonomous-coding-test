#!/bin/bash

# Magic Tower - Game Initialization Script
# This script sets up the development environment and starts the game

set -e  # Exit on error

echo "================================================"
echo "  Magic Tower (魔塔) - Game Initialization"
echo "================================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

print_success "Node.js is installed ($(node -v))"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi

print_success "npm is installed ($(npm -v))"

# Get the frontend port from .claude_settings.json or use default
FRONTEND_PORT=$(grep -o '"frontend_port": *[0-9]*' .claude_settings.json | grep -o '[0-9]*' || echo "3000")

print_info "Frontend will run on port: $FRONTEND_PORT"

echo ""
echo "================================================"
echo "  Installing Dependencies"
echo "================================================"
echo ""

# Install frontend dependencies if package.json exists
if [ -f "package.json" ]; then
    print_info "Installing frontend dependencies..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
    print_success "Frontend dependencies installed"
else
    print_info "No frontend package.json found, skipping..."
fi

# Install backend dependencies if server/package.json exists
if [ -f "server/package.json" ]; then
    print_info "Installing backend dependencies..."
    cd server
    npm install
    cd ..
    print_success "Backend dependencies installed"
else
    print_info "No backend package.json found, skipping..."
fi

echo ""
echo "================================================"
echo "  Starting Development Servers"
echo "================================================"
echo ""

# Start backend server if it exists
if [ -f "server/index.js" ] || [ -f "server/app.js" ]; then
    print_info "Starting backend server..."
    cd server
    mkdir -p logs
    node index.js > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    echo $BACKEND_PID > logs/backend.pid
    print_success "Backend server started (PID: $BACKEND_PID)"
    sleep 2
else
    print_info "No backend server found, skipping..."
fi

# Start frontend development server
if [ -f "package.json" ]; then
    print_info "Starting frontend development server..."

    # Check which package manager is available
    if command -v pnpm &> /dev/null; then
        PKG_MANAGER="pnpm"
    elif command -v npm &> /dev/null; then
        PKG_MANAGER="npm"
    else
        print_error "No package manager found!"
        exit 1
    fi

    # Start the dev server in background
    $PKG_MANAGER run dev > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > logs/frontend.pid

    # Wait for server to start
    print_info "Waiting for frontend server to start..."
    sleep 5

    # Check if the process is still running
    if ps -p $FRONTEND_PID > /dev/null; then
        print_success "Frontend server started (PID: $FRONTEND_PID)"
    else
        print_error "Frontend server failed to start!"
        echo "Check logs/frontend.log for errors"
        exit 1
    fi
else
    print_error "No frontend found!"
    exit 1
fi

echo ""
echo "================================================"
echo "  ✓ Setup Complete!"
echo "================================================"
echo ""
print_success "The Magic Tower game is now running!"
echo ""
echo "  Frontend URL: ${GREEN}http://localhost:$FRONTEND_PORT${NC}"
echo ""
echo "  To stop the servers, run:"
echo "    ${YELLOW}kill \$(cat logs/frontend.pid)${NC}"
echo "    ${YELLOW}kill \$(cat logs/backend.pid)${NC}"
echo ""
echo "  Or simply press Ctrl+C to stop all servers"
echo ""
echo "  Frontend logs: ${YELLOW}logs/frontend.log${NC}"
echo "  Backend logs:  ${YELLOW}logs/backend.log${NC}"
echo ""
echo "================================================"
echo ""

# Keep the script running
print_info "Press Ctrl+C to stop all servers..."
echo ""

# Handle Ctrl+C to clean up
cleanup() {
    echo ""
    print_info "Stopping servers..."
    if [ -f "logs/frontend.pid" ]; then
        kill $(cat logs/frontend.pid) 2>/dev/null || true
        rm logs/frontend.pid
    fi
    if [ -f "logs/backend.pid" ]; then
        kill $(cat logs/backend.pid) 2>/dev/null || true
        rm logs/backend.pid
    fi
    print_success "All servers stopped"
    exit 0
}

trap cleanup INT TERM

# Wait indefinitely
wait
