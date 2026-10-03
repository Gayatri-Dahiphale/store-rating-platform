const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('../middleware/auth');

const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 16;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && password.length <= maxLength && hasUpper && hasSpecial;
};


router.post('/register', async (req, res, next) => {
  try {
    const { name, email, address, password } = req.body;
    
    if (!name || name.length < 20 || name.length > 60) return res.status(400).json({ success: false, message: 'Name must be between 20 and 60 characters' });
    if (!address || address.length > 400) return res.status(400).json({ success: false, message: 'Address maximum length is 400 characters' });
    if (!validatePassword(password)) return res.status(400).json({ success: false, message: 'Password must be 8-16 characters, with at least one uppercase letter and one special character' });
    

    const userExist = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) return res.status(400).json({ success: false, message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, address, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
      [name, email, address, hash, 'NORMAL USER']
    );

    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    next(error);
  }
});


router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_jwt_key',
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
});


router.get('/me', authenticate, async (req, res, next) => {
  try {
    const userResult = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: userResult.rows[0] });
  } catch (error) {
    next(error);
  }
});


router.put('/password', authenticate, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!validatePassword(newPassword)) return res.status(400).json({ success: false, message: 'Invalid new password format' });
    
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    
    const isMatch = await bcrypt.compare(oldPassword, userResult.rows[0].password_hash);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Incorrect old password' });
    
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
