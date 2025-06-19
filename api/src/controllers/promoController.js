const db = require('../config/db');

exports.addPromoCode = async (req, res) => {
  const { code, discount } = req.body;
  try {
    // Check if promo code already exists
    const [existingCodes] = await db.execute('SELECT * FROM promo_codes WHERE code = ?', [code]);
    if (existingCodes.length > 0) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }

    await db.execute('INSERT INTO promo_codes (code, discount) VALUES (?, ?)', [code, discount]);
    res.status(201).json({ message: 'Promo code added' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllPromoCodes = async (req, res) => {
  try {
    const [codes] = await db.execute('SELECT * FROM promo_codes');
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePromoCode = async (req, res) => {
  const { id } = req.params;
  const { code, discount } = req.body;

  try {
    // Check if promo code exists
    const [existingCode] = await db.execute('SELECT * FROM promo_codes WHERE id = ?', [id]);
    if (existingCode.length === 0) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    // Check if new code already exists (excluding current code)
    if (code !== existingCode[0].code) {
      const [duplicateCodes] = await db.execute(
        'SELECT * FROM promo_codes WHERE code = ? AND id != ?',
        [code, id]
      );
      if (duplicateCodes.length > 0) {
        return res.status(400).json({ message: 'Promo code already exists' });
      }
    }

    await db.execute(
      'UPDATE promo_codes SET code = ?, discount = ? WHERE id = ?',
      [code, discount, id]
    );

    res.json({ message: 'Promo code updated successfully' });
  } catch (err) {
    console.error('Error updating promo code:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deletePromoCode = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if promo code exists
    const [existingCode] = await db.execute('SELECT * FROM promo_codes WHERE id = ?', [id]);
    if (existingCode.length === 0) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    await db.execute('DELETE FROM promo_codes WHERE id = ?', [id]);
    res.json({ message: 'Promo code deleted successfully' });
  } catch (err) {
    console.error('Error deleting promo code:', err);
    res.status(500).json({ error: 'Server error' });
  }
};