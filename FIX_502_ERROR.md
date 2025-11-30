# 🔧 HTTP 502 Error - Complete Fix Guide

## What is a 502 Error?

502 Bad Gateway means the backend server crashed, isn't running, or isn't responding properly. We've fixed the code issues. Now let's get it running.

## 🚀 Quick Fix (3 Steps)

### Step 1: Install Dependencies (if not done yet)
```bash
cd /workspaces/CansNTeens/backend
npm install
```

### Step 2: Start MongoDB (in a separate terminal)
```bash
mongod
```

### Step 3: Start Backend (in another terminal)
```bash
cd /workspaces/CansNTeens/backend
npm run dev
```

**Wait for this exact message:**
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
📚 API Base URL: http://localhost:5000/api
```

Then refresh your browser at `http://localhost:8000`

---

## ✅ What I Fixed

### Issue 1: Route Ordering
- Fixed `/categories/list` being caught by `/:id` route
- Fixed `/email/:email` being caught by `/:orderId` route
- Routes now in correct order (specific before generic)

### Issue 2: MongoDB Connection Error Handling
- Backend now starts even if MongoDB isn't running
- Better error messages in console
- Health check endpoint works without database

### Issue 3: Missing Error Handlers
- Added comprehensive error middleware
- Added 404 handler
- Better error logging

### Issue 4: Route Loading
- Added try-catch for route imports
- Better startup error messages
- Clearer console output

---

## 🔍 Verify It's Working

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```
**Should return:**
```json
{"status":"OK","message":"Cans & Teens backend is running"}
```

### Test 2: Get Menu
```bash
curl http://localhost:5000/api/menu
```
**Should return:**
```json
[]
```
(empty until you seed the database)

### Test 3: Backend Logs
Look at the terminal running the backend. You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

---

## 🆘 Still Getting 502?

### Check 1: Is Backend Running?
```bash
# In a new terminal
curl -v http://localhost:5000/api/health
```

If it hangs or "Connection refused", backend is not running.

**Fix**: Start backend with `npm run dev`

### Check 2: Is MongoDB Running?
Look at the backend terminal output:

```
✅ MongoDB connected successfully     ← Good
❌ MongoDB connection error: connect ECONNREFUSED  ← Bad
```

**Fix**: Start MongoDB with `mongod`

### Check 3: Check for Errors in Backend Terminal
The terminal running the backend should show any errors. Common ones:

```
Error loading routes: Cannot find module
→ Fix: npm install

Error: Port 5000 already in use
→ Fix: kill -9 <PID> or use different PORT

SyntaxError in routes
→ Fix: Check syntax in route files
```

### Check 4: Port 5000 Already in Use
```bash
lsof -i :5000
```

If something is using port 5000:
```bash
# Get the PID and kill it
kill -9 <PID>
```

Or change PORT in `.env`:
```
PORT=5001
```

---

## 📋 Complete Startup Checklist

Before starting backend, verify:

- [ ] `.env` file exists: `ls -la .env`
- [ ] `node_modules` installed: `ls -la node_modules | head -5`
- [ ] `package.json` OK: `cat package.json | head -10`
- [ ] All route files exist:
  ```bash
  ls -la routes/
  # Should show: menu.js, orders.js, auth.js, admin.js
  ```
- [ ] All model files exist:
  ```bash
  ls -la models/
  # Should show: Menu.js, Order.js, User.js
  ```
- [ ] `server.js` exists: `ls -la server.js`

---

## 🚀 Automated Startup Script

I've created `backend/start.sh` that does everything:

```bash
cd /workspaces/CansNTeens/backend
bash start.sh
```

This script will:
1. Check Node.js and npm
2. Create `.env` if needed
3. Install dependencies if needed
4. Check MongoDB
5. Start the backend

---

## 🐛 Debug Mode

For more detailed errors, start with debug output:

```bash
NODE_DEBUG=express npm run dev
```

Or see all logs:
```bash
npm run dev 2>&1 | tee backend.log
```

---

## 📊 Terminal Setup

### Option A: Multiple Terminal Tabs
1. Tab 1: `mongod`
2. Tab 2: `cd backend && npm run dev`
3. Tab 3: `cd .. && python3 -m http.server 8000`
4. Tab 4: Testing with `curl`

### Option B: Using screen
```bash
screen -S dev
# Then Ctrl+A, C to create new window
mongod
# Ctrl+A, C
cd /workspaces/CansNTeens/backend && npm run dev
# Ctrl+A, C
cd /workspaces/CansNTeens && python3 -m http.server 8000
```

### Option C: Using tmux
```bash
tmux new-session -d -s dev
tmux send-keys -t dev 'mongod' Enter
tmux new-window -t dev -c /workspaces/CansNTeens/backend -n backend
tmux send-keys -t dev:backend 'npm run dev' Enter
tmux new-window -t dev -c /workspaces/CansNTeens -n frontend
tmux send-keys -t dev:frontend 'python3 -m http.server 8000' Enter
tmux attach -t dev
```

---

## 🧪 Test Complete Flow

Once everything is running:

### 1. Test Backend
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK",...}
```

### 2. Test Frontend
```bash
curl http://localhost:8000
# Should return HTML (the index.html file)
```

### 3. Test API Endpoints
```bash
# Get menu
curl http://localhost:5000/api/menu

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"studentEmail":"test@test.com","items":[],"totalAmount":0}'

# Request PIN
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","rollNumber":"TEST"}'
```

All should return JSON responses.

---

## 📝 Logs to Check

### Backend Console Output
Should show:
```
✅ MongoDB connected successfully
✅ All routes loaded successfully
🚀 Server running on http://localhost:5000
```

### MongoDB Console Output
Should show:
```
[initandlisten] waiting for connections on port 27017
```

### Frontend Console Output
Should show:
```
Serving HTTP on 0.0.0.0 port 8000
```

---

## ✨ Final Checklist

After following all steps, you should have:

- ✅ MongoDB running (terminal 1)
- ✅ Backend running (terminal 2) on http://localhost:5000
- ✅ Frontend running (terminal 3) on http://localhost:8000
- ✅ No 502 errors
- ✅ API responding to curl requests

---

## 📞 Still Need Help?

Run the diagnostic script:
```bash
bash /workspaces/CansNTeens/diagnose.sh
```

This will check:
- Node.js and npm
- File structure
- Dependencies
- .env configuration
- Port availability
- MongoDB connection

---

**Status**: Code Fixed ✅ | Ready to Run 🚀
**Next**: Follow the "Quick Fix (3 Steps)" above!
