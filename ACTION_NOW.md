# 🚀 ACTION CHECKLIST - Get Backend Running Now

## ⏱️ Expected Time: 5 minutes

Follow these steps exactly to get your backend working:

---

## STEP 1: Open Terminal ✓
```bash
cd /workspaces/CansNTeens/backend
```

---

## STEP 2: Install Dependencies (2 min) ✓

```bash
npm install
```

**What to see:**
```
added X packages, and audited X packages in Ys
```

**If you see errors:**
- Try: `npm install --force`
- Or: `npm cache clean --force && npm install`

---

## STEP 3: Check `.env` File ✓

```bash
cat .env
```

**Should show:**
```
MONGODB_URI=mongodb://localhost:27017/cansteens
JWT_SECRET=your-secret-key-change-this-in-production-12345
ADMIN_KEY=your-admin-key-change-this-12345
PORT=5000
NODE_ENV=development
```

**If missing:**
```bash
cp .env.example .env
```

---

## STEP 4: Start MongoDB (In New Terminal) ✓

**Terminal Window #1 (Keep Open):**
```bash
mongod
```

**What to see:**
```
[initandlisten] waiting for connections on port 27017
```

**If MongoDB not installed:**
- Mac: `brew install mongodb-community`
- Linux: `sudo apt-get install mongodb`
- Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env

---

## STEP 5: Start Backend (In New Terminal) ✓

**Terminal Window #2:**
```bash
cd /workspaces/CansNTeens/backend
npm run dev
```

**What to see:**
```
[nodemon] starting `node server.js`
✅ MongoDB connected
🚀 Server running on http://localhost:5000
📚 API Base URL: http://localhost:5000/api
```

**If you see this, SUCCESS! ✅**

---

## STEP 6: Test Backend (In New Terminal) ✓

**Terminal Window #3:**

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"OK","message":"Cans & Teens backend is running"}
```

### Test 2: Get Menu (Empty until Seeded)
```bash
curl http://localhost:5000/api/menu
```

**Expected Response:**
```json
[]
```

**If both work, your backend is running! ✅**

---

## STEP 7: Optional - Seed Database ✓

Load 20 menu items:

**Terminal Window #3:**
```bash
cd /workspaces/CansNTeens/backend
node scripts/seed.js
```

**What to see:**
```
✅ Connected to MongoDB
🗑️  Cleared existing menu items
✅ Inserted 20 menu items
📋 Menu items:
  - Pav Bhaji (Indian) - ₹80
  - Samosa (Snacks) - ₹30
  ...

✅ Database seeding complete!
```

Then test again:
```bash
curl http://localhost:5000/api/menu | head -30
```

Should show menu items in JSON.

---

## STEP 8: Optional - Start Frontend ✓

**Terminal Window #4:**
```bash
cd /workspaces/CansNTeens
python3 -m http.server 8000
```

**What to see:**
```
Serving HTTP on 0.0.0.0 port 8000
```

Then visit: **http://localhost:8000**

---

## ✅ SUCCESS CHECKLIST

After all steps, you should have:

- [ ] **Terminal 1**: MongoDB running (`mongod`)
- [ ] **Terminal 2**: Backend running (`npm run dev`)
  - [ ] Shows "✅ MongoDB connected"
  - [ ] Shows "🚀 Server running on http://localhost:5000"
- [ ] **Terminal 3**: Tests passing
  - [ ] `curl http://localhost:5000/api/health` returns JSON
  - [ ] `curl http://localhost:5000/api/menu` returns JSON
- [ ] **Terminal 4** (Optional): Frontend running
  - [ ] Browser shows website at http://localhost:8000

---

## 🆘 If Something Goes Wrong

### Error: "Cannot GET /api/health"
- Backend not running
- Solution: `npm run dev` in backend directory

### Error: "MongoDB connection error"
- MongoDB not running
- Solution: `mongod` in separate terminal

### Error: "Port 5000 already in use"
- Another process using port 5000
- Solution: `lsof -i :5000` then `kill -9 <PID>`

### Error: "Module not found"
- Dependencies not installed
- Solution: `npm install`

### Error: "Cannot find .env"
- Configuration file missing
- Solution: `cp .env.example .env`

**For more help:**
- See `ERROR_DIAGNOSIS.md`
- Run `bash diagnose.sh`

---

## 📝 Test API Endpoints (Optional)

### Test PIN Request
```bash
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "name":"Test User",
    "rollNumber":"B001"
  }'
```

**Response:**
```json
{
  "message":"PIN generated (email not configured)",
  "email":"test@example.com",
  "testPin":"123456"
}
```

### Test PIN Verification
```bash
curl -X POST http://localhost:5000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "pin":"123456"
  }'
```

**Response includes JWT token for authentication**

### Test Order Creation
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "studentEmail":"test@example.com",
    "items":[{"menuId":"1","quantity":2}],
    "totalAmount":160,
    "notes":"Extra spicy"
  }'
```

**Response includes order ID like `ORD-1234567890-1`**

---

## 🎯 Quick Terminal Setup

If you want all 3 windows open at once:

**Approach 1: Use 3 separate terminal tabs**
1. Tab 1: `mongod`
2. Tab 2: `cd backend && npm run dev`
3. Tab 3: `curl http://localhost:5000/api/health`

**Approach 2: Use tmux or screen**
```bash
# Create session with 3 windows
tmux new-session -d -s dev -n mongo "mongod"
tmux new-window -t dev -n backend "cd backend && npm run dev"
tmux new-window -t dev -n test "bash"
tmux attach -t dev
```

**Approach 3: Use screen**
```bash
screen -S dev
# Press Ctrl+A then C to create new window
```

---

## 📚 Documentation Reference

| File | When to Read |
|------|--------------|
| **This file** | Right now - follow these steps |
| `STARTUP.md` | Need more details on setup |
| `ERROR_DIAGNOSIS.md` | Something is broken |
| `QUICK_REFERENCE.md` | Want API command reference |
| `backend/README.md` | Full API documentation |
| `INTEGRATION_GUIDE.md` | Connect frontend to API |

---

## 🎉 When You're Done

Your backend is ready when you see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
📚 API Base URL: http://localhost:5000/api
```

And API responds:
```bash
$ curl http://localhost:5000/api/health
{"status":"OK","message":"Cans & Teens backend is running"}
```

---

## 🚀 Next Steps After Backend Works

1. **Verify API**: Test endpoints with curl (see section above)
2. **Seed Database**: Run `node scripts/seed.js` to load 20 menu items
3. **Integrate Frontend**: Update `index.html` to use API (see `INTEGRATION_GUIDE.md`)
4. **Deploy**: Move to production when ready

---

**Time Estimate**: 5 minutes to running backend
**Difficulty**: Easy ✅
**Next**: Follow each step in order!

Let me know when you hit Step 1! 🚀
