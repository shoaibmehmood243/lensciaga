const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [existing] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashedPassword]);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [admin] = await db.execute("SELECT * FROM admins WHERE email = ?", [
      email,
    ]);
    if (admin.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin[0].password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin[0].id, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};
