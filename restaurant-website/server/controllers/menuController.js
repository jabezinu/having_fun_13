const MenuItem = require('../models/MenuItem');

// Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    // Add filtering options
    const category = req.query.category;
    const vegetarian = req.query.vegetarian === 'true';
    
    // Build query
    let query = {};
    if (category) query.category = category;
    if (req.query.vegetarian) query.vegetarian = vegetarian;

    const menuItems = await MenuItem.find(query);
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get featured menu items
exports.getFeaturedItems = async (req, res) => {
  try {
    const featuredItems = await MenuItem.find({ featured: true });
    res.json(featuredItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single menu item
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create menu item (Admin only)
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, vegetarian, spicy, featured } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      vegetarian: vegetarian === 'true',
      spicy: spicy === 'true',
      featured: featured === 'true',
      image: `/uploads/${req.file.filename}`
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update menu item (Admin only)
exports.updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, vegetarian, spicy, featured } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = price || menuItem.price;
      menuItem.category = category || menuItem.category;
      menuItem.vegetarian = vegetarian === 'true';
      menuItem.spicy = spicy === 'true';
      menuItem.featured = featured === 'true';
      
      if (req.file) {
        menuItem.image = `/uploads/${req.file.filename}`;
      }

      const updatedMenuItem = await menuItem.save();
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete menu item (Admin only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      await menuItem.remove();
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 