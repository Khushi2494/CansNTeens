# Frontend-Backend Integration Guide

This guide shows you how to connect your `index.html` frontend with the backend API.

## Current State

- **Frontend**: Single HTML file with hardcoded menu items and verification modal
- **Backend**: Fully functional REST API on http://localhost:5000
- **Goal**: Replace hardcoded data with live API calls

## Step-by-Step Integration

### 1. Replace Hardcoded Menu with API Call

**Before** (in your index.html script section):
```javascript
const menuData = [
  { id: '1', name: 'Pav Bhaji', category: 'Indian', price: 80, ... },
  // ... 19 more items
];
```

**After** - Add this function to fetch from API:
```javascript
async function loadMenuFromAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/menu');
    if (!response.ok) throw new Error('Failed to load menu');
    return await response.json();
  } catch (error) {
    console.error('Error loading menu:', error);
    // Fallback to local data if API fails
    return getLocalMenuData();
  }
}

function getLocalMenuData() {
  // Keep your hardcoded menu here as backup
  return [
    { id: '1', name: 'Pav Bhaji', category: 'Indian', price: 80, ... },
    // ... 19 more items
  ];
}
```

### 2. Update Initialization

Find where your menu is loaded on page load:
```javascript
// Replace this:
const menuData = [...];

// With this:
let menuData = [];
window.addEventListener('DOMContentLoaded', async () => {
  menuData = await loadMenuFromAPI();
  // Initialize rest of your app
  initializeApp();
});
```

### 3. Integrate PIN Verification with Backend

Replace your verification modal JavaScript with API calls:

```javascript
const verificationModal = document.getElementById('verificationModal');
const emailInput = document.getElementById('studentEmail');
const nameInput = document.getElementById('studentName');
const rollInput = document.getElementById('studentRoll');
const pinInput = document.getElementById('verificationPin');
const requestPinBtn = document.getElementById('requestPinBtn');
const verifyPinBtn = document.getElementById('verifyPinBtn');

// Request PIN
requestPinBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const name = nameInput.value.trim();
  const roll = rollInput.value.trim();

  if (!email || !name || !roll) {
    alert('Please fill all fields');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/request-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        rollNumber: roll,
        dob: new Date() // or get from input
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      alert('Error: ' + data.error);
      return;
    }

    alert('PIN sent to ' + email);
    // Show PIN input field
    pinInput.style.display = 'block';
    verifyPinBtn.style.display = 'block';
  } catch (error) {
    console.error('Error requesting PIN:', error);
    alert('Failed to request PIN');
  }
});

// Verify PIN
verifyPinBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const pin = pinInput.value.trim();

  if (!pin || pin.length !== 6) {
    alert('Please enter a valid 6-digit PIN');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pin })
    });

    const data = await response.json();
    
    if (!response.ok) {
      alert('Error: ' + data.error);
      return;
    }

    // Store token
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('studentEmail', email);
    localStorage.setItem('studentName', data.user.name);

    alert('Verification successful!');
    verificationModal.style.display = 'none';
    emailInput.value = '';
    nameInput.value = '';
    rollInput.value = '';
    pinInput.value = '';
  } catch (error) {
    console.error('Error verifying PIN:', error);
    alert('Verification failed');
  }
});
```

### 4. Update Order Submission

When user clicks checkout/order button:

```javascript
async function submitOrder(cartItems, totalAmount) {
  const email = localStorage.getItem('studentEmail');
  const token = localStorage.getItem('authToken');

  if (!email) {
    alert('Please verify first');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Optional
      },
      body: JSON.stringify({
        studentEmail: email,
        items: cartItems.map(item => ({
          menuId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount,
        notes: document.getElementById('orderNotes')?.value || ''
      })
    });

    const order = await response.json();
    
    if (!response.ok) {
      alert('Error: ' + order.error);
      return;
    }

    alert(`Order placed! Order ID: ${order.orderId}`);
    localStorage.setItem('lastOrderId', order.orderId);
    
    // Clear cart and refresh
    clearCart();
    return order;
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place order');
  }
}
```

### 5. Check Order Status

Add ability to track orders:

```javascript
async function getOrderStatus(orderId) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/orders/${orderId}`
    );
    
    if (!response.ok) throw new Error('Order not found');
    
    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Example: Show order status
async function showOrderStatus() {
  const orderId = localStorage.getItem('lastOrderId');
  if (!orderId) return;

  const order = await getOrderStatus(orderId);
  if (order) {
    console.log('Order Status:', order.status);
    console.log('Order Total:', order.totalAmount);
    // Update UI with status
  }
}
```

### 6. Handle API Errors Gracefully

Create a helper function:

```javascript
async function apiCall(endpoint, options = {}) {
  const baseURL = 'http://localhost:5000/api';
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(baseURL + endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Usage:
// const menu = await apiCall('/menu');
// await apiCall('/orders', { method: 'POST', body: JSON.stringify(orderData) });
```

## Testing the Integration

### 1. Start Both Servers

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd /workspaces/CansNTeens
python3 -m http.server 8000
```

### 2. Test Each Flow

**Test Menu Loading**:
```javascript
// In browser console
fetch('http://localhost:5000/api/menu')
  .then(r => r.json())
  .then(data => console.log(data));
```

**Test PIN Request**:
```javascript
fetch('http://localhost:5000/api/auth/request-pin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@school.com',
    name: 'Test User',
    rollNumber: 'TEST001'
  })
}).then(r => r.json()).then(data => console.log(data));
```

**Test PIN Verification**:
```javascript
// Use the PIN that was sent
fetch('http://localhost:5000/api/auth/verify-pin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@school.com',
    pin: '123456'
  })
}).then(r => r.json()).then(data => console.log(data));
```

## Common Issues & Solutions

### CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**: Backend already has CORS enabled, but verify:
- Backend is running on port 5000
- Frontend is on http://localhost:8000
- No firewalls blocking the connection

### Token Issues
**Problem**: "Invalid token" errors

**Solution**:
- Verify PIN and get new token
- Check token expiry: tokens last 7 days
- Clear localStorage and re-verify

### Menu Not Loading
**Problem**: Blank menu or "Failed to load menu"

**Solution**:
- Check backend is running: `curl http://localhost:5000/api/health`
- Seed database: `node backend/scripts/seed.js`
- Check browser console for errors

### Email Not Sending
**Problem**: "Error sending email"

**Solution**:
- Use Gmail App Password (not regular password)
- Or configure SendGrid in .env
- Check .env EMAIL_USER and EMAIL_PASSWORD

## Security Notes

1. **Never hardcode API secrets** in frontend
2. **Store token securely**: Use secure cookies or localStorage
3. **Validate all inputs** before sending to API
4. **Use HTTPS in production** (not just HTTP)
5. **Admin key**: Keep it secret, never expose in frontend code

## Next Steps

1. ✅ Backend is ready
2. 📝 Update your index.html with API integration
3. 🧪 Test each endpoint
4. 🚀 Deploy both frontend and backend
5. 📊 Monitor orders and analytics

## Example Full Integration (Simplified)

```javascript
// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Load menu from API
  try {
    const menu = await fetch('http://localhost:5000/api/menu')
      .then(r => r.json());
    displayMenu(menu);
  } catch (e) {
    console.error('Failed to load menu:', e);
  }

  // Check if user already verified
  const token = localStorage.getItem('authToken');
  if (token) {
    showMainApp();
  } else {
    showVerificationModal();
  }
});

// Handle order checkout
document.getElementById('checkoutBtn').addEventListener('click', async () => {
  const cart = getCartItems();
  const total = calculateTotal(cart);
  
  try {
    const order = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentEmail: localStorage.getItem('studentEmail'),
        items: cart,
        totalAmount: total
      })
    }).then(r => r.json());
    
    alert(`Order placed! ID: ${order.orderId}`);
  } catch (e) {
    alert('Order failed: ' + e.message);
  }
});
```

---

**Ready to integrate?** Start with step 1 and test as you go! 🚀
