# Cans & Teens - Quick Start Guide

## 📋 Project Structure

```
CansNTeens/
├── index.html           # Frontend (Tailwind CSS + Tone.js)
├── verification.js      # PIN verification modal
├── firebase-config.js   # Optional Firebase config
└── backend/             # Node.js + Express + MongoDB API
    ├── server.js
    ├── package.json
    ├── .env.example
    ├── models/          # MongoDB schemas
    ├── routes/          # REST API endpoints
    ├── middleware/      # Auth middleware
    ├── utils/           # Helper functions
    └── scripts/         # Database seeding
```

## 🚀 Getting Started

### 1. Frontend Setup (Already Running)

The frontend is a single HTML file running on **http://localhost:8000**

If you need to restart it:
```bash
cd /workspaces/CansNTeens
python3 -m http.server 8000
```

### 2. Backend Setup

**Step 1: Navigate to backend**
```bash
cd /workspaces/CansNTeens/backend
```

**Step 2: Copy environment template**
```bash
cp .env.example .env
```

**Step 3: Edit `.env` file**
- Set `MONGODB_URI` to your MongoDB connection string
- Set `JWT_SECRET` to a random string (e.g., `openssl rand -base64 32`)
- Set `ADMIN_KEY` to a secure admin key
- Set `EMAIL_USER` and `EMAIL_PASSWORD` for Gmail (or use SendGrid)

**Step 4: Install dependencies**
```bash
npm install
```

**Step 5: Seed database (optional but recommended)**
```bash
node scripts/seed.js
```

**Step 6: Start the backend**
```bash
npm run dev
# or npm start for production
```

Backend will run on **http://localhost:5000**

### 3. Verify Both Are Running

- Frontend: http://localhost:8000
- Backend API: http://localhost:5000/api/health

## 📡 API Quick Reference

### Authentication
```bash
# Request PIN
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","name":"John","rollNumber":"B001"}'

# Verify PIN
curl -X POST http://localhost:5000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","pin":"123456"}'
```

### Menu
```bash
# Get all menu items
curl http://localhost:5000/api/menu

# Filter by category
curl http://localhost:5000/api/menu?category=Snacks
```

### Orders
```bash
# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"studentEmail":"student@example.com","items":[{"menuId":"1","quantity":2}],"totalAmount":160}'

# Get order status
curl http://localhost:5000/api/orders/ORD-1234567890-1
```

## 🔧 Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongod`
- Check `.env` file exists and has correct values
- Check port 5000 is not in use: `lsof -i :5000`

### Email not sending
- Use [Gmail App Password](https://support.google.com/accounts/answer/185833), not regular password
- Or use SendGrid API key in `.env`

### CORS errors
- Make sure backend is running on port 5000
- Frontend should be on http://localhost:8000

## 📚 Documentation

- **Backend API Docs**: See `/workspaces/CansNTeens/backend/README.md`
- **Database Models**: See backend README for schema details
- **Frontend Integration**: Update `index.html` to use API endpoints (see backend README for examples)

## 🎯 Next Steps

1. **Seed the database**: `node scripts/seed.js` - loads 20 menu items
2. **Integrate frontend with backend**: Update `index.html` to fetch from `/api/menu`
3. **Test authentication**: Use request-pin → verify-pin flow
4. **Create orders**: Test order creation and status updates
5. **Admin features**: Use x-admin-key header to access admin endpoints

## 📞 Support

For detailed API documentation, see `/workspaces/CansNTeens/backend/README.md`

---

**Backend Status**: ✅ Complete and ready to use
**Frontend Status**: ✅ Running and ready for API integration
