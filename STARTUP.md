# 🚀 Backend Startup Guide

## Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)  
- [ ] MongoDB running locally OR MongoDB Atlas account

## Step 1: Install Dependencies

```bash
cd /workspaces/CansNTeens/backend
npm install
```

This installs all required packages (express, mongoose, jwt, etc.)

## Step 2: Verify .env File

Your `.env` file is ready at `/workspaces/CansNTeens/backend/.env`

**Important**: 
- For MongoDB Atlas, update `MONGODB_URI` with your connection string
- For local MongoDB, keep the default `mongodb://localhost:27017/cansteens`
- Email is optional for testing

## Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
# Keep this running in a separate terminal
```

**Option B: MongoDB Atlas (Cloud)**
- No setup needed if you already have a connection string
- Just update `MONGODB_URI` in `.env`

## Step 4: Start Backend Server

```bash
cd /workspaces/CansNTeens/backend
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
📚 API Base URL: http://localhost:5000/api
```

## Step 5: Test Backend

Open a new terminal and test:

```bash
# Test 1: Health check
curl http://localhost:5000/api/health

# Test 2: Get menu (empty until seeded)
curl http://localhost:5000/api/menu
```

## Step 6: Seed Database (Optional)

Load 20 menu items:

```bash
cd /workspaces/CansNTeens/backend
node scripts/seed.js
```

Then test again:
```bash
curl http://localhost:5000/api/menu | head -50
```

## Step 7: Test Frontend

Open a new terminal:

```bash
cd /workspaces/CansNTeens
python3 -m http.server 8000
```

Visit: **http://localhost:8000**

## 🆘 Troubleshooting

### Error: "Cannot connect to MongoDB"
```bash
# Make sure MongoDB is running
mongod
```

### Error: "Port 5000 already in use"
```bash
# Find and kill the process using port 5000
lsof -i :5000
kill -9 <PID>
```

### Error: "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Email not sending
- Email is optional for testing
- The API will show the PIN in the response and console
- To enable email, configure `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`

## ✅ Quick Verification

All systems working? You should see:

```
Terminal 1 (Backend):
✅ MongoDB connected
🚀 Server running on http://localhost:5000

Terminal 2 (Frontend):
Serving HTTP on 0.0.0.0 port 8000

Terminal 3 (Test):
curl http://localhost:5000/api/health
{"status":"OK","message":"Cans & Teens backend is running"}
```

## 📱 Next Steps

1. Backend is running ✅
2. Test API endpoints (see QUICK_REFERENCE.md)
3. Integrate with frontend (see INTEGRATION_GUIDE.md)
4. Deploy to production

## 📞 Need Help?

- Check backend logs for errors
- See backend/README.md for detailed API docs
- See QUICK_REFERENCE.md for common commands
