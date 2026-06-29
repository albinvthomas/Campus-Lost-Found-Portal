const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Electronics',
      'ID/Documents',
      'Clothing',
      'Accessories',
      'Books/Stationery',
      'Keys',
      'Wallet/Bag',
      'Water Bottle',
      'Other',
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ['lost', 'found'],
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'recovered'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
