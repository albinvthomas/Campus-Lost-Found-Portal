const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/items - Get all items with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    
    // Build query object
    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error fetching items' });
  }
});

// GET /api/items/my - Get items for the logged-in user (must be before /:id)
router.get('/my', auth, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ message: 'Server error fetching user items' });
  }
});

// GET /api/items/:id - Get a single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('userId', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error fetching item' });
  }
});

// POST /api/items - Create a new item
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, type, location, date, status } = req.body;
    
    const newItem = new Item({
      title,
      description,
      category,
      type,
      location,
      date,
      status: status || 'active',
      userId: req.userId,
    });

    if (req.file) {
      newItem.image = req.file.filename;
    }

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error creating item' });
  }
});

// PUT /api/items/:id - Update an item
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, location, date, status } = req.body;

    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify ownership
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Update fields
    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (date) item.date = date;
    if (status) item.status = status;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error updating item' });
  }
});

// DELETE /api/items/:id - Delete an item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify ownership
    if (item.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    // You could also use item.deleteOne() or Item.findByIdAndDelete() but need to make sure hooks run if any
    await Item.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error deleting item' });
  }
});

module.exports = router;
