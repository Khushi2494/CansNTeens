# 📚 Quick Reference Guide

## 🚀 First Time Setup (Copy & Paste)

### Terminal 1: Setup Backend
```bash
cd /workspaces/CansNTeens/backend
npm install
cp .env.example .env
# Edit .env and add your config
```

### Terminal 2: Start MongoDB
```bash
mongod
```

### Terminal 3: Seed Database
```bash
cd /workspaces/CansNTeens/backend
node scripts/seed.js
```

### Terminal 4: Start Backend
```bash
cd /workspaces/CansNTeens/backend
npm run dev
```

### Terminal 5: Start Frontend (if not already running)
```bash
cd /workspaces/CansNTeens
python3 -m http.server 8000
```

## ✅ Verify Everything Works

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check menu loads
curl http://localhost:5000/api/menu | head -20

# Visit frontend
# http://localhost:8000
```

## 🔗 API Endpoints Quick Reference

### Menu (No Auth)
```
GET  /api/menu                    Get all items
GET  /api/menu?category=Snacks   Filter by category  
GET  /api/menu/1                 Get item #1
GET  /api/menu/categories/list   Get all categories
```

### Auth (No Auth)
```
POST /api/auth/request-pin       Send PIN to email
POST /api/auth/verify-pin        Verify PIN, get token
```

### Orders (No Auth Required)
```
POST /api/orders                 Create order
GET  /api/orders/ORD-xxx-1       Track order
GET  /api/orders/email/a@b.com   Get student orders
```

### Admin (Requires x-admin-key)
```
GET  /api/admin/menu             List menu
POST /api/admin/menu             Add item
PATCH /api/admin/menu/1          Edit item
DELETE /api/admin/menu/1         Remove item
GET  /api/admin/orders           List all orders
PATCH /api/orders/ORD-xxx-1/status  Update status
GET  /api/admin/analytics        Get stats
```

## 📨 Test PIN Verification

### Step 1: Request PIN
```bash
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "name":"Test User",
    "rollNumber":"B001"
  }'
```
**Check your email for PIN** (or check MongoDB directly)

### Step 2: Verify PIN
```bash
curl -X POST http://localhost:5000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "pin":"123456"
  }'
```
**Response includes JWT token**

## 🛒 Test Order Creation

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "studentEmail":"test@example.com",
    "items":[
      {"menuId":"1","quantity":2},
      {"menuId":"3","quantity":1}
    ],
    "totalAmount":250,
    "notes":"No onions"
  }'
```
**Response includes order ID (e.g., ORD-1234567890-1)**

## 👨‍💼 Test Admin Features

### List All Orders (Admin)
```bash
curl -H "x-admin-key: your-admin-key" \
  http://localhost:5000/api/admin/orders
```

### Update Order Status (Admin)
```bash
curl -X PATCH http://localhost:5000/api/orders/ORD-1234567890-1/status \
  -H "x-admin-key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'
```

### Get Analytics (Admin)
```bash
curl -H "x-admin-key: your-admin-key" \
  http://localhost:5000/api/admin/analytics
```

## 📁 Directory Structure

```
CansNTeens/
├── index.html                   ← Frontend
├── verification.js              ← PIN modal
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── .env                     ← Create this!
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── scripts/
│   └── README.md
├── START_HERE.md                ← Read this first
├── QUICKSTART.md
├── ARCHITECTURE.md
├── INTEGRATION_GUIDE.md
└── CHECKLIST.md
```

## 🔐 .env Configuration

```bash
# Required
MONGODB_URI=mongodb://localhost:27017/cansteens
JWT_SECRET=your-secret-key-here
ADMIN_KEY=your-admin-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional
PORT=5000
NODE_ENV=development
```

## 🚨 Common Issues & Fixes

### Issue: "Cannot connect to MongoDB"
```bash
# Fix: Start MongoDB
mongod
```

### Issue: "Port 5000 already in use"
```bash
# Fix: Kill the process
lsof -i :5000
kill -9 <PID>
```

### Issue: "Email not sending"
```bash
# Fix: Use Gmail App Password
# Go to: https://myaccount.google.com/apppasswords
# Generate one and use it in .env
```

### Issue: "CORS error in browser"
```bash
# Fix: Ensure backend runs on port 5000
# and frontend on port 8000
```

## 📊 Database Check

### View Menu Items
```bash
mongosh
> use cansteens
> db.menus.find().pretty()
```

### View Orders
```bash
> db.orders.find().pretty()
```

### View Users
```bash
> db.users.find().pretty()
```

## 🧪 Test Data

### Sample Menu Item
```json
{
  "id": "1",
  "name": "Pav Bhaji",
  "category": "Indian",
  "price": 80,
  "image": "https://...",
  "description": "Spicy potato curry with bread",
  "available": true,
  "preparationTime": 10
}
```

### Sample Order
```json
{
  "studentEmail": "student@school.com",
  "items": [
    {"menuId": "1", "quantity": 2},
    {"menuId": "3", "quantity": 1}
  ],
  "totalAmount": 250,
  "notes": "Extra spicy"
}
```

## 🔄 Order Status Flow

```
Created → pending
   ↓
Confirmed by admin → confirmed
   ↓
Started preparing → preparing
   ↓
Ready for delivery → ready
   ↓
Delivered → delivered

(Or at any stage: cancelled)
```

## 📞 Documentation Map

| Need Help With? | Read This |
|-----------------|-----------|
| Getting started | START_HERE.md |
| Setup backend | QUICKSTART.md |
| API documentation | backend/README.md |
| System architecture | ARCHITECTURE.md |
| Frontend integration | INTEGRATION_GUIDE.md |
| Project checklist | CHECKLIST.md |

## 🎯 Frontend Integration Checklist

- [ ] Load menu from `/api/menu` instead of hardcoded data
- [ ] Call `/api/auth/request-pin` for PIN request
- [ ] Call `/api/auth/verify-pin` for verification
- [ ] Store JWT token in localStorage
- [ ] Call `/api/orders` to submit orders
- [ ] Call `/api/orders/:orderId` to track orders
- [ ] Show loading spinners during API calls
- [ ] Display error messages when API fails

## 💡 Pro Tips

1. **Use Postman**: Download Postman to test APIs visually
2. **Keep .env secret**: Add to .gitignore
3. **Monitor logs**: Watch terminal for errors
4. **Test locally first**: Before deploying
5. **Backup database**: Regularly export data
6. **Use git**: Commit changes frequently
7. **Read errors**: Check console for helpful messages

## 🚀 Deployment Preparation

1. Switch NODE_ENV to production
2. Use strong JWT_SECRET (e.g., `openssl rand -base64 32`)
3. Use MongoDB Atlas (not local)
4. Use SendGrid (not Gmail)
5. Set up SSL/HTTPS
6. Configure firewall
7. Enable logging
8. Set up monitoring

## 📞 Emergency Commands

### Start Fresh
```bash
cd backend && npm install && npm run dev
```

### Reset Database
```bash
cd backend && node scripts/seed.js
```

### Check All Services
```bash
# MongoDB
mongosh --eval "db.version()"

# Backend
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:8000
```

## 📚 External Resources

- Node.js Docs: https://nodejs.org/docs/
- Express Docs: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- Mongoose: https://mongoosejs.com/
- JWT Info: https://jwt.io/

---

**Quick Reference** | Last Updated: After Backend Implementation | Status: ✅ Complete
