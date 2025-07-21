const db = require('../config/db');
const { sendMail } = require('../services/mail');
const { generateOrderEmailHTML, generateUpdateOrderStatusEmailHTML } = require('../utils/email-templates');
require('dotenv').config();

// Helper function to generate random order ID
const generateOrderId = () => {
  // Get current timestamp in milliseconds (for uniqueness)
  const timestamp = Date.now().toString().slice(-4);
  
  // Generate 3 random numbers
  const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
  
  // Combine with prefix
  return `LENS${timestamp}${randomNum}`;
};

exports.placeOrder = async (req, res) => {
  const { name, email, phone, address, items, totalAmount, promoCode } = req.body;

  try {
    // Generate unique order ID
    const orderId = generateOrderId();

    // Validate and update product quantities
    for (const item of items) {
      const [productResult] = await db.execute('SELECT quantity FROM products WHERE id = ?', [item.id]);
      const product = productResult[0];

      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({
          error: `Product ID ${item.id} is out of stock or insufficient quantity`
        });
      }

      await db.execute('UPDATE products SET quantity = quantity - ? WHERE id = ?', [
        item.quantity,
        item.id
      ]);
    }

    // Promo code check
    const [promoResult] = promoCode
      ? await db.execute('SELECT * FROM promo_codes WHERE code = ?', [promoCode])
      : [[]];

    const promo = promoResult[0];
    const discount = promo ? promo.discount : 0;
    const discountedTotal = totalAmount - (totalAmount * discount) / 100;

    // If promo code not valid, set it to empty string
    const promoCodeToSave = promo ? promo.code : '';

    const [result] = await db.execute(
      'INSERT INTO orders (order_id, name, email, phone, address, items, total_amount, promo_code, discount_applied) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [orderId, name, email, phone, address, JSON.stringify(items), discountedTotal, promoCodeToSave, discount]
    );

    const htmlContent = generateOrderEmailHTML(orderId, name, email, items, discountedTotal, promoCodeToSave, discount);

    // Send email to admin
    await sendMail('shoaibmehmood065@gmail.com', 'New Order Received', htmlContent);

    // Send email to user
    await sendMail(email, 'Order Confirmation', htmlContent);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: orderId,
      order: {
        id: result.insertId,
        orderId,
        name,
        email,
        items,
        totalAmount: discountedTotal,
        promoCode: promoCodeToSave,
        discount
      }
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to place order'
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const [result] = await db.execute('UPDATE orders SET order_status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Fetch user details and email
    const [orderDetails] = await db.execute(
      'SELECT name, email FROM orders WHERE id = ?',
      [id]
    );

    if (orderDetails.length > 0) {
      const { name, email } = orderDetails[0];

      // Send email
      const subject = `Update on Your Order #${id}`;

      await sendMail(email, subject, generateUpdateOrderStatusEmailHTML(name, status, id));
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute('SELECT * FROM orders');
    const formatted = orders.map(o => ({ ...o, items: JSON.parse(o.items || '[]') }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    // Get order details
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = { ...orders[0], items: JSON.parse(orders[0].items || '[]') };
    
    // Get product details for each item
    const itemsWithDetails = await Promise.all(
      order.items.map(async (item) => {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [item.id]);
        if (products.length > 0) {
          const product = products[0];
          return {
            ...item,
            name: product.name,
            description: product.description,
            image_url: JSON.parse(product.images || '[]')[0] || null,
            category: product.category
          };
        }
        return item;
      })
    );

    // Update order with detailed items
    order.items = itemsWithDetails;
    
    res.json(order);
  } catch (err) {
    console.error('Error in getOrderById:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
