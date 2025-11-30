# 🔧 Error Diagnosis & Solutions

## Common Errors at http://localhost:5000

### Error 1: "Cannot GET /api/health" or similar 404

**Cause**: Backend not running

**Solution**:
```bash
cd /workspaces/CansNTeens/backend
npm install          # Install dependencies first
npm run dev          # Start backend
```

You should see:
```
> cansteens-backend@1.0.0 dev
> nodemon server.js

[nodemon] 2.0.20
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
✅ MongoDB connected
🚀 Server running on http://localhost:5000
📚 API Base URL: http://localhost:5000/api
```

---

### Error 2: "MongoDB connection error"

**Cause**: MongoDB not running

**Solution A: Local MongoDB**
```bash
# Start MongoDB in a separate terminal
mongod

# Or with specific path:
mongod --dbpath /data/db
```

**Solution B: MongoDB Atlas (Cloud)**
```bash
# Update .env file:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cansteens
```

Get connection string from: https://cloud.mongodb.com/

---

### Error 3: "Module not found: express" or similar

**Cause**: Dependencies not installed

**Solution**:
```bash
cd /workspaces/CansNTeens/backend
npm install
```

Or reinstall fresh:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Error 4: "Port 5000 already in use"

**Cause**: Another process running on port 5000

**Solution**:
```bash
# Find process on port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=5001
```

---

### Error 5: "Cannot find module './routes/menu'" or similar

**Cause**: Route files not created properly

**Solution**:
```bash
# Check files exist
ls -la /workspaces/CansNTeens/backend/routes/
# Should show: menu.js, orders.js, auth.js, admin.js

# Check models exist
ls -la /workspaces/CansNTeens/backend/models/
# Should show: Menu.js, Order.js, User.js

# Check utils exist
ls -la /workspaces/CansNTeens/backend/utils/
# Should show: auth.js
```

---

### Error 6: "ValidationError: email is required"

**Cause**: Invalid request data

**Solution**: Send proper JSON:
```bash
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "name":"Test User",
    "rollNumber":"B001"
  }'
```

---

## Step-by-Step Diagnostics

### 1. Check Installation
```bash
cd /workspaces/CansNTeens/backend
npm list
# Shows all installed packages
```

### 2. Check Configuration
```bash
cat .env
# Should show MONGODB_URI, JWT_SECRET, etc.
```

### 3. Check Files Exist
```bash
# List all backend files
find . -name "*.js" | sort
```

### 4. Test MongoDB
```bash
mongosh
# Or: mongo
show dbs
use cansteens
db.version()
```

### 5. Start with Debug Output
```bash
NODE_DEBUG=* npm run dev
# Shows detailed debug information
```

### 6. Check Server Logs
```bash
# If server started:
# Look at terminal output for errors
# Common issues:
# - ❌ MongoDB connection error: connection failed
# - ❌ Cannot find module: missing dependency
# - ❌ Port already in use: another process running
```

---

## Complete Fresh Start

If everything is broken, do a complete reset:

```bash
# 1. Stop any running processes
# Press Ctrl+C in all terminals

# 2. Delete node_modules
cd /workspaces/CansNTeens/backend
rm -rf node_modules package-lock.json

# 3. Reinstall
npm install

# 4. Create fresh .env
cp .env.example .env

# 5. Start MongoDB
mongod

# 6. Start backend in new terminal
npm run dev

# 7. Test in another terminal
curl http://localhost:5000/api/health
```

---

## Verify Each Component

### Component 1: Node.js
```bash
node --version
# Should show v14+ or v16+
```

### Component 2: npm
```bash
npm --version
# Should show 6+
```

### Component 3: MongoDB
```bash
# If local:
mongosh --version
# or: mongo --version

# Or test connection:
mongosh "mongodb://localhost:27017"
```

### Component 4: Backend
```bash
npm run dev
# Should start without errors
```

### Component 5: API
```bash
curl http://localhost:5000/api/health
# Should return JSON response
```

---

## Error Log Analysis

### If you see this:
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Port in use → kill process or change PORT in .env

### If you see this:
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: MongoDB not running → start mongod

### If you see this:
```
SyntaxError: Unexpected token } in JSON
```
**Solution**: Invalid .env file → check syntax

### If you see this:
```
Cannot find module 'express'
```
**Solution**: Dependencies not installed → npm install

### If you see this:
```
env: nodemon: No such file or directory
```
**Solution**: Reinstall dependencies → npm install

---

## Testing Endpoints

Once backend is running:

### Test Menu
```bash
curl http://localhost:5000/api/menu
```

### Test Health
```bash
curl http://localhost:5000/api/health
```

### Test Auth
```bash
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","rollNumber":"TEST"}'
```

### Test Orders
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"studentEmail":"test@test.com","items":[],"totalAmount":0}'
```

---

## Quick Checklist

Before declaring success, verify:

- [ ] `mongod` is running
- [ ] `npm install` completed
- [ ] `.env` file exists
- [ ] `npm run dev` shows no errors
- [ ] `curl http://localhost:5000/api/health` returns JSON
- [ ] `curl http://localhost:5000/api/menu` returns JSON (even if empty)

---

## Still Having Issues?

1. **Share the exact error message** from the terminal
2. **Check the full terminal output** (not just one line)
3. **Verify file structure** matches expected layout
4. **Try complete fresh start** (delete node_modules, reinstall)
5. **Check port 5000** is actually listening

Run this to get full diagnostic:
```bash
echo "=== Node ===" && node --version && \
echo "=== npm ===" && npm --version && \
echo "=== MongoDB ===" && mongosh --version && \
echo "=== Files ===" && ls -la backend/*.js && \
echo "=== Dependencies ===" && npm list --depth=0 && \
echo "=== Env ===" && cat backend/.env | head -5 && \
echo "=== Attempting start ===" && npm run dev --prefix backend
```

This will show all diagnostics at once.

---

**Last Updated**: After Backend Implementation
**Status**: Ready for debugging
