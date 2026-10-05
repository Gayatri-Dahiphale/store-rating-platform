const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('SYSTEM ADMINISTRATOR'));


router.get('/dashboard', async (req, res, next) => {
  try {
    // get all three counts in one query instead of three separate ones
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM stores) AS total_stores,
        (SELECT COUNT(*) FROM ratings) AS total_ratings
    `);

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        totalUsers: parseInt(row.total_users),
        totalStores: parseInt(row.total_stores),
        totalRatings: parseInt(row.total_ratings)
      }
    });
  } catch (error) {
    next(error);
  }
});


router.get('/users', async (req, res, next) => {
  try {
    let { search, role, sort, order } = req.query;
    const values = [];
    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (name ILIKE $${values.length} OR email ILIKE $${values.length} OR address ILIKE $${values.length})`;
    }
    
    if (role) {
      values.push(role);
      query += ` AND role = $${values.length}`;
    }

    const validSorts = ['name', 'email', 'address', 'role'];
    if (sort && validSorts.includes(sort)) {
      query += ` ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    } else {
      query += ` ORDER BY id ASC`;
    }

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});


router.post('/users', async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!name || name.length < 20 || name.length > 60)
      return res.status(400).json({ success: false, message: 'Name must be 20-60 characters' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    if (!address || address.length > 400)
      return res.status(400).json({ success: false, message: 'Address must be 400 characters or fewer' });
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!password || password.length < 8 || password.length > 16 || !hasUpper || !hasSpecial)
      return res.status(400).json({ success: false, message: 'Password must be 8-16 characters with at least one uppercase and one special character' });
    if (!['SYSTEM ADMINISTRATOR', 'NORMAL USER', 'STORE OWNER'].includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role' });

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ success: false, message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, address, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
      [name, email, address, hash, role]
    );
    res.status(201).json({ success: true, message: 'User created' });
  } catch (error) {
    next(error);
  }
});


router.get('/stores', async (req, res, next) => {
  try {
    let { search, sort, order } = req.query;
    const values = [];
    let query = `
      SELECT s.id, s.name, s.email, s.address, 
      COALESCE(AVG(r.rating), 0)::numeric(10,2) as overall_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (s.name ILIKE $${values.length} OR s.email ILIKE $${values.length} OR s.address ILIKE $${values.length})`;
    }

    query += ` GROUP BY s.id`;

    const validSorts = ['name', 'email', 'address', 'average_rating'];
    if (sort && validSorts.includes(sort)) {
      query += ` ORDER BY ${sort} ${order === 'desc' ? 'DESC' : 'ASC'}`;
    } else {
      query += ` ORDER BY s.id ASC`;
    }

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});


router.post('/stores', async (req, res, next) => {
  try {
    const { name, email, address, owner_id } = req.body;
    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)',
      [name, email, address, owner_id]
    );
    res.status(201).json({ success: true, message: 'Store created' });
  } catch (error) {
    next(error);
  }
});


router.get('/users/:id', async (req, res, next) => {
  try {
    const userRes = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [req.params.id]);
    if (userRes.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const user = userRes.rows[0];

    if (user.role === 'STORE OWNER') {
      const storesRes = await pool.query(`
        SELECT s.id, s.name, COALESCE(AVG(r.rating), 0)::numeric(10,2) as average_rating 
        FROM stores s LEFT JOIN ratings r ON s.id = r.store_id 
        WHERE s.owner_id = $1 GROUP BY s.id
      `, [user.id]);
      user.stores = storesRes.rows;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
