# Cans & Teens - Project Overview

## 📱 Full Stack Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Port 8000)                     │
│                  ┌──────────────────────┐                   │
│                  │   index.html         │                   │
│                  │  - Tailwind CSS      │                   │
│                  │  - Tone.js (audio)   │                   │
│                  │  - Category wheel    │                   │
│                  │  - Cart system       │                   │
│                  │  - Verification UI   │                   │
│                  └──────┬───────────────┘                   │
│                         │ AJAX/Fetch                        │
│                         │ http://localhost:5000/api         │
│                         ▼                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Port 5000)                      │
│                                                             │
│         ┌──────────────────────────────────────┐           │
│         │       Express Server (Node.js)       │           │
│         │ ✓ CORS enabled                       │           │
│         │ ✓ JSON middleware                    │           │
│         │ ✓ Error handling                     │           │
│         └──────────────────────────────────────┘           │
│                          │                                 │
│         ┌────────────────┼────────────────┐               │
│         ▼                ▼                ▼               │
│      ┌─────────┐  ┌─────────┐  ┌─────────────────┐     │
│      │  Routes │  │Middleware│  │   Utilities    │     │
│      │         │  │          │  │                │     │
│      │• Menu   │  │• Auth    │  │• JWT tokens    │     │
│      │• Orders │  │• Admin   │  │• PIN generate  │     │
│      │• Auth   │  │          │  │• Encryption    │     │
│      │• Admin  │  └─────────┘  └─────────────────┘     │
│      └─────────┘                                        │
│           │                                             │
│         ┌─▼────────────────────────────────────┐       │
│         │    MongoDB Collections               │       │
│         │                                      │       │
│         │ • Menus (20 dishes)                 │       │
│         │ • Orders (with status tracking)     │       │
│         │ • Users (verified students)         │       │
│         └──────────────────────────────────────┘       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## 🎯 User Journey

```
┌─────────────────────────────────────────────────────────┐
│ 1. STUDENT VISITS WEBSITE                              │
│    ↓                                                    │
│    Shows: Verification modal (email, name, roll no.)   │
│    User enters details                                 │
│                                                         │
│ 2. REQUEST PIN                                         │
│    ↓                                                    │
│    POST /api/auth/request-pin                          │
│    Backend: Generates 6-digit PIN, sends email         │
│    Student receives: PIN in mailbox                    │
│                                                         │
│ 3. VERIFY PIN                                          │
│    ↓                                                    │
│    POST /api/auth/verify-pin                           │
│    Backend: Validates PIN (15 min expiry)              │
│    Student receives: JWT token (7-day valid)           │
│                                                         │
│ 4. BROWSE MENU                                         │
│    ↓                                                    │
│    GET /api/menu (can filter by category)              │
│    Display: 20 dishes with prices, images              │
│    Backend: Serves from MongoDB                        │
│                                                         │
│ 5. ADD TO CART                                         │
│    ↓                                                    │
│    Local storage (no API needed)                       │
│    Calculate total, show items                        │
│                                                         │
│ 6. PLACE ORDER                                         │
│    ↓                                                    │
│    POST /api/orders                                    │
│    Data: Student email, items, total amount            │
│    Response: Order ID (e.g., ORD-1234567890-1)        │
│                                                         │
│ 7. TRACK ORDER                                         │
│    ↓                                                    │
│    GET /api/orders/{orderId}                           │
│    Status: pending → confirmed → preparing →          │
│            ready → delivered                          │
│                                                         │
│ 8. RECEIVE ORDER                                       │
│    ↓                                                    │
│    Order ready for delivery                            │
│    Student collects from counter                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📊 Admin Dashboard Flow

```
┌──────────────────────────────────────────────────┐
│ ADMIN FEATURES (x-admin-key header required)    │
│                                                  │
│ 1. VIEW ALL ORDERS                              │
│    GET /api/admin/orders                        │
│    - Filter by status                           │
│    - Filter by student email                    │
│    - See all order details                      │
│                                                  │
│ 2. UPDATE ORDER STATUS                          │
│    PATCH /api/orders/{orderId}/status           │
│    - pending → confirmed → preparing           │
│    - preparing → ready                         │
│    - ready → delivered                         │
│    - Any → cancelled (refund)                  │
│                                                  │
│ 3. MANAGE MENU                                  │
│    POST /api/admin/menu         (Add item)     │
│    PATCH /api/admin/menu/:id    (Edit item)    │
│    DELETE /api/admin/menu/:id   (Remove item)  │
│    GET /api/admin/menu          (List all)     │
│                                                  │
│ 4. VIEW ANALYTICS                               │
│    GET /api/admin/analytics                    │
│    - Total orders count                        │
│    - Pending orders count                      │
│    - Completed orders count                    │
│    - Total revenue                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

## 🔐 Authentication System

```
┌────────────────────────────────────────────────────┐
│ VERIFICATION FLOW                                 │
│                                                   │
│ Email-based PIN (No passwords needed!)           │
│                                                   │
│ Step 1: Enter Email                              │
│    └──→ Check if user exists, create if not      │
│                                                   │
│ Step 2: Generate PIN                             │
│    └──→ 6-digit random code                      │
│    └──→ Expires in 15 minutes                    │
│    └──→ Saved in database                        │
│                                                   │
│ Step 3: Send Email                               │
│    └──→ Via Gmail or SendGrid                    │
│    └──→ Contains PIN in message                  │
│                                                   │
│ Step 4: Verify PIN                               │
│    └──→ Compare with stored PIN                  │
│    └──→ Check expiry time                        │
│    └──→ Generate JWT token (7-day valid)         │
│                                                   │
│ Step 5: Token for Requests                       │
│    └──→ Include in Authorization header          │
│    └──→ Validate with JWT middleware             │
│    └──→ Protected endpoints check token          │
│                                                   │
└────────────────────────────────────────────────────┘
```

## 📁 Complete File Structure

```
CansNTeens/
│
├── Frontend (HTML)
│   ├── index.html                  (Main app)
│   ├── verification.js             (PIN modal)
│   └── firebase-config.js          (Optional)
│
├── Backend (Node.js)
│   ├── package.json                (Dependencies)
│   ├── server.js                   (Express app)
│   ├── .env.example                (Config template)
│   │
│   ├── models/
│   │   ├── Menu.js                 (Dishes schema)
│   │   ├── Order.js                (Orders schema)
│   │   └── User.js                 (Students schema)
│   │
│   ├── routes/
│   │   ├── menu.js                 (GET endpoints)
│   │   ├── orders.js               (Create/track)
│   │   ├── auth.js                 (PIN verify)
│   │   └── admin.js                (Management)
│   │
│   ├── middleware/
│   │   └── auth.js                 (JWT, Admin)
│   │
│   ├── utils/
│   │   └── auth.js                 (JWT, PIN)
│   │
│   ├── scripts/
│   │   └── seed.js                 (Load menu)
│   │
│   └── README.md                   (API docs)
│
└── Documentation
    ├── START_HERE.md               (Quick overview)
    ├── QUICKSTART.md               (5-min setup)
    ├── BACKEND_COMPLETE.md         (Features)
    ├── INTEGRATION_GUIDE.md        (Frontend code)
    └── README.md                   (Project info)
```

## 🚀 API Endpoints Summary

```
BASE_URL: http://localhost:5000/api

PUBLIC ENDPOINTS
├── Menu (No auth needed)
│   ├── GET    /menu                Get all items
│   ├── GET    /menu/:id            Get one item
│   └── GET    /menu/categories/list Get categories
│
├── Auth (No auth needed)
│   ├── POST   /auth/request-pin    Request verification
│   └── POST   /auth/verify-pin     Get JWT token
│
└── Orders (Some need JWT)
    ├── POST   /orders              Create order
    ├── GET    /orders/:orderId     Get order
    ├── GET    /orders/email/:email Get student orders
    └── PATCH  /orders/:id/status   Update (admin-key)

ADMIN ENDPOINTS (x-admin-key header required)
├── GET    /admin/menu             List menu
├── POST   /admin/menu             Add menu item
├── PATCH  /admin/menu/:id         Update menu
├── DELETE /admin/menu/:id         Delete menu
├── GET    /admin/orders           List all orders
└── GET    /admin/analytics        Get stats

UTILITY
└── GET    /health                 Server status
```

## 💾 Database Schema

```
MENU COLLECTION
{
  _id: ObjectId,
  id: String (unique),
  name: String,
  category: String,
  price: Number,
  image: String (URL),
  description: String,
  available: Boolean,
  preparationTime: Number,
  createdAt: Date,
  updatedAt: Date
}

ORDER COLLECTION
{
  _id: ObjectId,
  orderId: String (e.g., ORD-1234567890-1),
  studentEmail: String,
  items: [{
    menuId: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  status: String (pending|confirmed|preparing|ready|delivered|cancelled),
  paymentStatus: String (pending|completed|refunded),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

USER COLLECTION
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  rollNumber: String,
  dob: Date,
  phone: String,
  verified: Boolean,
  role: String (student|admin|staff),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Data Flow

```
FRONTEND REQUEST
    │
    ├──→ Browser fetch() API
    ├──→ Include JWT token (if needed)
    ├──→ Set Content-Type: application/json
    ▼

BACKEND RECEIVES
    │
    ├──→ Express parses request
    ├──→ Middleware validates token (if protected)
    ├──→ Middleware checks admin key (if admin)
    ├──→ Route handler processes request
    ├──→ Query/update MongoDB
    ▼

DATABASE OPERATION
    │
    ├──→ Mongoose performs operation
    ├──→ Returns data or error
    ▼

BACKEND RESPONSE
    │
    ├──→ Format JSON response
    ├──→ Add status code
    ├──→ Send to frontend
    ▼

FRONTEND RECEIVES
    │
    ├──→ Check response status
    ├──→ Parse JSON
    ├──→ Update UI
    ├──→ Store data locally if needed
    ▼

USER SEES RESULT
```

## 🛠️ Tech Stack Details

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | HTML5 | - | Structure |
| **Frontend** | CSS (Tailwind) | - | Styling |
| **Frontend** | JavaScript | ES6+ | Interactivity |
| **Frontend** | Tone.js | - | Audio |
| **Backend** | Node.js | 14+ | Runtime |
| **Backend** | Express.js | 4.x | Web framework |
| **Backend** | MongoDB | 4.x | Database |
| **Backend** | Mongoose | 6.x | ORM |
| **Backend** | JWT | - | Auth tokens |
| **Backend** | bcryptjs | - | Password hash |
| **Backend** | Nodemailer | - | Email |
| **Backend** | CORS | - | Cross-origin |

## 📈 Scalability Path

```
Current Setup (Development)
├─ Single server
├─ Local MongoDB
└─ Email via Gmail

↓ Scale to Production

Production Setup
├─ Deploy to Heroku/AWS/GCP
├─ MongoDB Atlas (cloud)
├─ Email via SendGrid
├─ Redis for caching
├─ Load balancer
└─ CDN for assets
```

## ✨ Key Features Implemented

- ✅ Email verification (PIN-based, no passwords)
- ✅ JWT authentication (7-day tokens)
- ✅ Dynamic menu from database
- ✅ Order creation with unique order IDs
- ✅ Order status tracking (6 states)
- ✅ Admin dashboard for management
- ✅ Analytics (revenue, orders count)
- ✅ Menu CRUD operations
- ✅ Role-based access control
- ✅ Input validation
- ✅ Error handling
- ✅ CORS support
- ✅ Nodemailer integration
- ✅ Database seeding

## 🎓 How to Use This Project

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `python3 -m http.server 8000`
3. **Seed Database**: `node backend/scripts/seed.js`
4. **Visit**: http://localhost:8000
5. **Test API**: See INTEGRATION_GUIDE.md

## 📞 Need Help?

- API Docs: See `backend/README.md`
- Setup: See `QUICKSTART.md`
- Integration: See `INTEGRATION_GUIDE.md`
- Troubleshooting: See `BACKEND_COMPLETE.md`

---

**Status**: Backend 100% complete ✅ | Frontend ready for integration 🚀
