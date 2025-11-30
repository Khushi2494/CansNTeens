#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const Menu = require('../models/Menu');

// Menu data from frontend
const menuData = [
  {
    id: '1',
    name: 'Pav Bhaji',
    category: 'Indian',
    price: 80,
    image: 'https://i.pinimg.com/474x/4c/c0/20/4cc020f1e46e0e37ea9c35e5097aadca.jpg',
    description: 'Spicy potato curry with bread',
    preparationTime: 10,
  },
  {
    id: '2',
    name: 'Samosa',
    category: 'Snacks',
    price: 30,
    image: 'https://i.pinimg.com/474x/6e/15/80/6e15809f0c0c9e7db9dcc8c0f9c5c6c8.jpg',
    description: 'Crispy fried pastry with spiced potato',
    preparationTime: 8,
  },
  {
    id: '3',
    name: 'Dosa',
    category: 'South Indian',
    price: 60,
    image: 'https://i.pinimg.com/474x/9c/5e/3c/9c5e3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Crispy pancake with sambar and chutney',
    preparationTime: 12,
  },
  {
    id: '4',
    name: 'Idli',
    category: 'South Indian',
    price: 40,
    image: 'https://i.pinimg.com/474x/5e/5c/3c/5e5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Steamed rice cake with sambar',
    preparationTime: 10,
  },
  {
    id: '5',
    name: 'Vada Pav',
    category: 'Snacks',
    price: 25,
    image: 'https://i.pinimg.com/474x/7e/5c/3c/7e5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Spicy potato ball in bread',
    preparationTime: 8,
  },
  {
    id: '6',
    name: 'Misal Pav',
    category: 'Indian',
    price: 70,
    image: 'https://i.pinimg.com/474x/8e/5c/3c/8e5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Spicy sprouted beans with bread',
    preparationTime: 12,
  },
  {
    id: '7',
    name: 'Biryani',
    category: 'Rice',
    price: 120,
    image: 'https://i.pinimg.com/474x/9e/5c/3c/9e5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Fragrant rice with meat',
    preparationTime: 20,
  },
  {
    id: '8',
    name: 'Fried Rice',
    category: 'Rice',
    price: 90,
    image: 'https://i.pinimg.com/474x/ae/5c/3c/ae5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Rice stir-fried with vegetables',
    preparationTime: 12,
  },
  {
    id: '9',
    name: 'Butter Chicken',
    category: 'Curries',
    price: 150,
    image: 'https://i.pinimg.com/474x/be/5c/3c/be5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Creamy tomato-based chicken curry',
    preparationTime: 15,
  },
  {
    id: '10',
    name: 'Paneer Tikka',
    category: 'Appetizers',
    price: 100,
    image: 'https://i.pinimg.com/474x/ce/5c/3c/ce5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Grilled cottage cheese with spices',
    preparationTime: 10,
  },
  {
    id: '11',
    name: 'Tandoori Chicken',
    category: 'Appetizers',
    price: 130,
    image: 'https://i.pinimg.com/474x/de/5c/3c/de5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Spiced grilled chicken',
    preparationTime: 18,
  },
  {
    id: '12',
    name: 'Noodles',
    category: 'Fast Food',
    price: 70,
    image: 'https://i.pinimg.com/474x/ee/5c/3c/ee5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Stir-fried noodles with vegetables',
    preparationTime: 10,
  },
  {
    id: '13',
    name: 'Burger',
    category: 'Fast Food',
    price: 80,
    image: 'https://i.pinimg.com/474x/fe/5c/3c/fe5c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Classic beef burger',
    preparationTime: 8,
  },
  {
    id: '14',
    name: 'Pizza',
    category: 'Fast Food',
    price: 100,
    image: 'https://i.pinimg.com/474x/0f/6c/3c/0f6c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Cheesy pizza with toppings',
    preparationTime: 15,
  },
  {
    id: '15',
    name: 'Frankie',
    category: 'Snacks',
    price: 60,
    image: 'https://i.pinimg.com/474x/1f/6c/3c/1f6c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Rolled flatbread with filling',
    preparationTime: 10,
  },
  {
    id: '16',
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 60,
    image: 'https://i.pinimg.com/474x/2f/6c/3c/2f6c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Rich chocolate cake slice',
    preparationTime: 5,
  },
  {
    id: '17',
    name: 'Ice Cream',
    category: 'Desserts',
    price: 40,
    image: 'https://i.pinimg.com/474x/3f/6c/3c/3f6c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Vanilla ice cream cup',
    preparationTime: 3,
  },
  {
    id: '18',
    name: 'Soft Drink',
    category: 'Beverages',
    price: 30,
    image: 'https://i.pinimg.com/474x/4f/6c/3c/4f6c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Cola or sprite',
    preparationTime: 2,
  },
  {
    id: '19',
    name: 'Lassi',
    category: 'Beverages',
    price: 40,
    image: 'https://i.pinimg.com/474x/5f/6c/3c/5f6c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Traditional yogurt drink',
    preparationTime: 3,
  },
  {
    id: '20',
    name: 'Fresh Juice',
    category: 'Beverages',
    price: 50,
    image: 'https://i.pinimg.com/474x/6f/6c/3c/6f6c3c0e0f5f5c5e0f5c9c5e3c0f5c5.jpg',
    description: 'Fresh orange or apple juice',
    preparationTime: 5,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cansteens', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing menu
    await Menu.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    // Insert menu data
    const inserted = await Menu.insertMany(
      menuData.map(item => ({
        ...item,
        available: true,
      }))
    );

    console.log(`✅ Inserted ${inserted.length} menu items`);
    console.log('📋 Menu items:');
    inserted.forEach(item => {
      console.log(`  - ${item.name} (${item.category}) - ₹${item.price}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database seeding complete!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
