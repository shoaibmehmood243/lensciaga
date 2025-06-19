const db = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

// Helper function to validate image files
const validateImages = (files) => {
  if (!files) return { valid: true, images: [] };
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  for (const file of files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Only JPG, PNG and GIF images are allowed' };
    }
    if (file.size > maxSize) {
      return { valid: false, error: 'Image size should not exceed 5MB' };
    }
  }
  
  return { valid: true, images: files };
};

// Helper function to delete old images
const deleteOldImages = async (imagePaths) => {
  try {
    for (const imagePath of imagePaths) {
      const fullPath = path.join(__dirname, '../..', imagePath);
      await fs.unlink(fullPath);
    }
  } catch (error) {
    console.error('Error deleting old images:', error);
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, price, category, quantity } = req.body;
  const files = req.files;

  try {
    // Validate category
    if (!['men', 'women', 'children'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate images
    const { valid, error, images } = validateImages(files);
    if (!valid) {
      return res.status(400).json({ message: error });
    }

    // Check image count
    if (images.length > 5) {
      return res.status(400).json({ message: 'Maximum 5 images allowed' });
    }

    // Process images
    const imagePaths = images.map(file => `/uploads/${file.filename}`);

    // Insert product
    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, category, quantity, images) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || '', price || 0, category, quantity, JSON.stringify(imagePaths)]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      category,
      quantity,
      images: imagePaths
    });
  } catch (err) {
    console.error('Error adding product:', err);
    // If there's an error, try to clean up uploaded files
    if (req.files) {
      await deleteOldImages(req.files.map(file => `/uploads/${file.filename}`));
    }
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products');
    const formatted = products.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }));
    res.json(formatted);
  } catch (err) {
    console.error('Error getting all products:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (product.length === 0) return res.status(404).json({ message: 'Product not found' });
    const parsed = { ...product[0], images: JSON.parse(product[0].images || '[]') };
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, quantity, existingImages } = req.body;
  const files = req.files;

  try {
    // Check if product exists
    const [existingProductResult] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (existingProductResult.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate category if provided
    if (category && !['men', 'women', 'children'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const existingProduct = existingProductResult[0];
    const currentImages = JSON.parse(existingProduct.images || '[]');
    
    // Parse existingImages from request body
    const imagesToKeep = existingImages ? JSON.parse(existingImages) : [];
    
    // Validate new images if provided
    if (files && files.length > 0) {
      const { valid, error } = validateImages(files);
      if (!valid) {
        return res.status(400).json({ message: error });
      }

      // Check total image count
      if (files.length + imagesToKeep.length > 5) {
        return res.status(400).json({ message: 'Maximum 5 images allowed' });
      }

      // Process new images
      const newImagePaths = files.map(file => `/uploads/${file.filename}`);
      
      // Combine kept and new images
      const finalImages = [...imagesToKeep, ...newImagePaths];
      
      // Delete removed images
      const imagesToDelete = currentImages.filter(img => !imagesToKeep.includes(img));
      await deleteOldImages(imagesToDelete);
      
      // Update product with combined images
      await db.execute(
        'UPDATE products SET name = ?, description = ?, price = ?, category = ?, quantity = ?, images = ? WHERE id = ?',
        [name, description, price, category, quantity, JSON.stringify(finalImages), id]
      );

      res.json({ 
        message: 'Product updated successfully',
        images: finalImages
      });
    } else {
      // If no new images, just update with kept images
      if (imagesToKeep.length > 5) {
        return res.status(400).json({ message: 'Maximum 5 images allowed' });
      }

      // Delete removed images
      const imagesToDelete = currentImages.filter(img => !imagesToKeep.includes(img));
      await deleteOldImages(imagesToDelete);
      
      // Update product with kept images
      await db.execute(
        'UPDATE products SET name = ?, description = ?, price = ?, category = ?, quantity = ?, images = ? WHERE id = ?',
        [name, description, price, category, quantity, JSON.stringify(imagesToKeep), id]
      );

      res.json({ 
        message: 'Product updated successfully',
        images: imagesToKeep
      });
    }
  } catch (err) {
    console.error('Error updating product:', err);
    // If there's an error and new files were uploaded, try to clean them up
    if (req.files) {
      await deleteOldImages(req.files.map(file => `/uploads/${file.filename}`));
    }
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Get product images before deleting
    const [product] = await db.execute('SELECT images FROM products WHERE id = ?', [id]);
    if (product.length > 0) {
      const images = JSON.parse(product[0].images || '[]');
      // Delete product images
      await deleteOldImages(images);
    }

    // Delete product from database
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error' });
  }
};