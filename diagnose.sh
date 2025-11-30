#!/bin/bash

# Cans & Teens Backend Diagnostic Script
# Run this to diagnose any backend issues

echo "╔════════════════════════════════════════════════╗"
echo "║  Cans & Teens Backend Diagnostic Tool         ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_command() {
  if command -v "$1" &> /dev/null; then
    echo -e "${GREEN}✓${NC} $1 is installed"
    "$1" --version
    return 0
  else
    echo -e "${RED}✗${NC} $1 is NOT installed"
    return 1
  fi
}

check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} File exists: $1"
    return 0
  else
    echo -e "${RED}✗${NC} File missing: $1"
    return 1
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} Directory exists: $1"
    return 0
  else
    echo -e "${RED}✗${NC} Directory missing: $1"
    return 1
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. CHECKING SYSTEM TOOLS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_command node
NODE_CHECK=$?
echo ""
check_command npm
NPM_CHECK=$?
echo ""
check_command mongosh
MONGO_CHECK=$?
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. CHECKING PROJECT FILES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_dir "/workspaces/CansNTeens/backend"
echo ""
check_file "/workspaces/CansNTeens/backend/package.json"
echo ""
check_file "/workspaces/CansNTeens/backend/server.js"
echo ""
check_file "/workspaces/CansNTeens/backend/.env"
echo ""
check_dir "/workspaces/CansNTeens/backend/models"
echo ""
check_dir "/workspaces/CansNTeens/backend/routes"
echo ""
check_dir "/workspaces/CansNTeens/backend/middleware"
echo ""
check_dir "/workspaces/CansNTeens/backend/utils"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. CHECKING NODE MODULES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d "/workspaces/CansNTeens/backend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} node_modules directory exists"
  echo "  Installed packages:"
  cd /workspaces/CansNTeens/backend && npm list --depth=0 2>/dev/null | head -15
else
  echo -e "${RED}✗${NC} node_modules directory NOT found"
  echo "  Run: npm install"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. CHECKING ENVIRONMENT CONFIGURATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "/workspaces/CansNTeens/backend/.env" ]; then
  echo -e "${GREEN}✓${NC} .env file exists"
  echo "  Content:"
  head -5 /workspaces/CansNTeens/backend/.env | sed 's/^/    /'
else
  echo -e "${RED}✗${NC} .env file NOT found"
  echo "  Run: cp .env.example .env"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. CHECKING PORT AVAILABILITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if lsof -i :5000 &> /dev/null; then
  echo -e "${YELLOW}⚠${NC} Port 5000 is IN USE"
  echo "  Process:"
  lsof -i :5000 | tail -1 | sed 's/^/    /'
  echo "  To free up: kill -9 <PID>"
else
  echo -e "${GREEN}✓${NC} Port 5000 is available"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. CHECKING MONGODB CONNECTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if mongosh "mongodb://localhost:27017" --eval "db.version()" &> /dev/null; then
  echo -e "${GREEN}✓${NC} MongoDB is running locally"
else
  echo -e "${YELLOW}⚠${NC} Cannot connect to local MongoDB"
  echo "  Start MongoDB with: mongod"
  echo "  Or configure MongoDB Atlas URI in .env"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. CHECKING FRONTEND FILES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_file "/workspaces/CansNTeens/index.html"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. SUMMARY & RECOMMENDATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $NODE_CHECK -eq 0 ] && [ $NPM_CHECK -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Node.js and npm are ready"
else
  echo -e "${RED}✗${NC} Node.js or npm not found - install them first"
fi

if [ -f "/workspaces/CansNTeens/backend/node_modules/express/package.json" ]; then
  echo -e "${GREEN}✓${NC} Dependencies are installed"
else
  echo -e "${YELLOW}⚠${NC} Dependencies not fully installed"
  echo "  Run: cd /workspaces/CansNTeens/backend && npm install"
fi

if [ -f "/workspaces/CansNTeens/backend/.env" ]; then
  echo -e "${GREEN}✓${NC} Configuration file (.env) exists"
else
  echo -e "${YELLOW}⚠${NC} Configuration file (.env) missing"
  echo "  Run: cp .env.example .env"
fi

if lsof -i :5000 &> /dev/null; then
  echo -e "${YELLOW}⚠${NC} Port 5000 is already in use"
else
  echo -e "${GREEN}✓${NC} Port 5000 is available for backend"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Start MongoDB (in separate terminal):"
echo "   mongod"
echo ""
echo "2. Start backend (in another terminal):"
echo "   cd /workspaces/CansNTeens/backend"
echo "   npm run dev"
echo ""
echo "3. Test backend (in another terminal):"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "4. Start frontend (if needed):"
echo "   cd /workspaces/CansNTeens"
echo "   python3 -m http.server 8000"
echo ""
echo "5. Visit http://localhost:8000 in browser"
echo ""
