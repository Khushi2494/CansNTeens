#!/bin/bash

echo "╔════════════════════════════════════════════════╗"
echo "║     Cans & Teens Backend - Quick Starter      ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

cd /workspaces/CansNTeens/backend

echo "🔍 Checking prerequisites..."
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install it first."
  exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found."
  exit 1
fi
echo "✅ npm: $(npm --version)"

# Check .env
if [ ! -f ".env" ]; then
  echo "⚠️  .env file not found. Creating from template..."
  cp .env.example .env
  echo "✅ .env created"
fi

# Check node_modules
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies (this may take a minute)..."
  npm install
  if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
  fi
  echo "✅ Dependencies installed"
fi

# Check MongoDB
echo ""
echo "🔍 Checking MongoDB..."
if mongosh "mongodb://localhost:27017" --eval "db.version()" &> /dev/null; then
  echo "✅ MongoDB is running"
else
  echo "⚠️  MongoDB not running on localhost:27017"
  echo "   Start MongoDB with: mongod"
  echo ""
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Server will run on: http://localhost:5000"
echo "API Base URL: http://localhost:5000/api"
echo ""
echo "Test endpoints:"
echo "  curl http://localhost:5000/api/health"
echo "  curl http://localhost:5000/api/menu"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
