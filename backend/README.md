# Cans & Teens Backend

A Node.js + Express + MongoDB REST API for the Cans & Teens canteen ordering system.

## Features

- **User Authentication**: Email-based PIN verification with JWT tokens
- **Menu Management**: Dynamic menu with categories and availability
- **Order Management**: Full order lifecycle (pending → confirmed → preparing → ready → delivered)
- **Admin Dashboard**: Analytics, menu CRUD, order management
- **Role-Based Access**: Student, Admin, and Staff roles
- **Email Notifications**: Send verification PINs and order updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random secret key (generate with `openssl rand -base64 32`)
   - `ADMIN_KEY`: A secret admin key
   - `EMAIL_USER` & `EMAIL_PASSWORD`: Gmail credentials or SendGrid API key

3. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

4. **Start the server**
   ```bash
   npm start          # production mode
   npm run dev        # development with nodemon (auto-reload)
   ```

   Server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Menu Routes
- `GET /api/menu` - Get all menu items (with optional filters)
  - Query params: `category`, `available`
- `GET /api/menu/:id` - Get a specific menu item
- `GET /api/menu/categories/list` - Get all categories

### Authentication Routes
- `POST /api/auth/request-pin` - Request a verification PIN
  - Body: `{ email, name, rollNumber, dob }`
  - Response: PIN sent to email
- `POST /api/auth/verify-pin` - Verify PIN and get JWT token
  - Body: `{ email, pin }`
  - Response: `{ token, user }`

### Order Routes
- `POST /api/orders` - Create a new order
  - Body: `{ studentEmail, items: [{menuId, quantity}], totalAmount, notes }`
- `GET /api/orders/:orderId` - Get order details (requires JWT token)
- `GET /api/orders/email/:email` - Get all orders for a student
- `PATCH /api/orders/:orderId/status` - Update order status (admin-only)
  - Header: `x-admin-key: your-admin-key`
  - Body: `{ status: "pending|confirmed|preparing|ready|delivered|cancelled" }`

### Admin Routes (require `x-admin-key` header)
- `GET /api/admin/menu` - List all menu items
- `POST /api/admin/menu` - Add a new menu item
  - Body: `{ id, name, category, price, image, description, preparationTime }`
- `PATCH /api/admin/menu/:id` - Update a menu item
- `DELETE /api/admin/menu/:id` - Delete a menu item
- `GET /api/admin/orders` - List all orders (with optional filters)
  - Query params: `status`, `email`
- `GET /api/admin/analytics` - Get order statistics

## Database Models

### Menu
```javascript
{
  id: String (unique),
  name: String,
  category: String,
  price: Number,
  image: String (URL),
  description: String,
  available: Boolean,
  preparationTime: Number (minutes),
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  orderId: String (auto-generated, e.g., ORD-1234567890-1),
  userId: ObjectId,
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
  deliveryTime: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### User
```javascript
{
  email: String (unique),
  name: String,
  rollNumber: String,
  dob: Date,
  phone: String,
  password: String (hashed),
  verified: Boolean,
  verificationPin: String,
  pinExpiry: Date,
  role: String (student|admin|staff),
  createdAt: Date,
  updatedAt: Date
}
```

## Example Requests

### 1. Request PIN for new student
```bash
curl -X POST http://localhost:5000/api/auth/request-pin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "name": "John Doe",
    "rollNumber": "B001",
    "dob": "2002-01-15"
  }'
```

### 2. Verify PIN and get token
```bash
curl -X POST http://localhost:5000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "pin": "123456"
  }'
```

### 3. Create an order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "studentEmail": "student@example.com",
    "items": [
      { "menuId": "1", "quantity": 2 },
      { "menuId": "3", "quantity": 1 }
    ],
    "totalAmount": 250,
    "notes": "Extra spicy please"
  }'
```

### 4. Get all menu items
```bash
curl http://localhost:5000/api/menu
```

### 5. Update order status (admin)
```bash
curl -X PATCH http://localhost:5000/api/orders/ORD-1234567890-1/status \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-admin-key" \
  -d '{
    "status": "confirmed"
  }'
```

## Database Seeding (Optional)

To populate the database with menu items from the frontend:

```bash
node scripts/seed.js
```

## Deployment

### Heroku
```bash
# Add MongoDB Atlas URI to Heroku config
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cansteens

# Deploy
git push heroku main
```

### Docker
```bash
docker build -t cans-teens-backend .
docker run -p 5000:5000 --env-file .env cans-teens-backend
```

## Frontend Integration

Update your `index.html` to use the API:

```javascript
// Fetch menu from backend
async function loadMenu() {
  const response = await fetch('http://localhost:5000/api/menu');
  const menu = await response.json();
  // Use menu data
}

// Request PIN
async function requestPin(email, name, rollNumber, dob) {
  const response = await fetch('http://localhost:5000/api/auth/request-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, rollNumber, dob })
  });
  const data = await response.json();
  return data;
}

// Verify PIN
async function verifyPin(email, pin) {
  const response = await fetch('http://localhost:5000/api/auth/verify-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pin })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}

// Create order
async function createOrder(studentEmail, items, totalAmount, notes) {
  const response = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentEmail, items, totalAmount, notes })
  });
  const order = await response.json();
  return order;
}
```

## Troubleshooting

### MongoDB connection error
- Ensure MongoDB is running (`mongod`)
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

### Email not sending
- Gmail: Use [App Passwords](https://support.google.com/accounts/answer/185833), not your regular password
- SendGrid: Use API key instead
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`

### CORS errors
- Ensure frontend URL is allowed in CORS middleware in `server.js`
- Update `cors()` to: `cors({ origin: 'http://localhost:8000' })`

## Support

For issues or questions, contact the development team.
