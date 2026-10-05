const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);


router.get('/', authorize('NORMAL USER'), async (req, res, next) => {
  try {
    const { search, sort, order } = req.query;
    const values = [req.user.id];
    let query = `
      SELECT s.id, s.name, s.address,
      COALESCE(AVG(r.rating), 0)::numeric(10,2) as overall_rating,
      my_r.rating as my_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings my_r ON s.id = my_r.store_id AND my_r.user_id = $1
      WHERE 1=1
    `;

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (s.name ILIKE $${values.length} OR s.address ILIKE $${values.length})`;
    }

    query += ` GROUP BY s.id, my_r.rating`;

    const validSorts = ['name', 'address', 'overall_rating', 'my_rating'];
    if (sort && validSorts.includes(sort)) {
      query += ` ORDER BY ${sort} ${order === 'desc' ? 'DESC NULLS LAST' : 'ASC NULLS FIRST'}`;
    } else {
      query += ` ORDER BY s.name ASC`;
    }

    const result = await pool.query(query, values);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});


router.get('/my/ratings', authorize('NORMAL USER'), async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT s.id, s.name, r.rating, r.updated_at
            FROM ratings r
            JOIN stores s ON r.store_id = s.id
            WHERE r.user_id = $1
            ORDER BY r.updated_at DESC
        `, [req.user.id]);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
});

router.post('/:storeId/rating', authorize('NORMAL USER'), async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating must be 1-5' });

    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)',
      [req.user.id, storeId, rating]
    );
    res.status(201).json({ success: true, message: 'Rating submitted' });
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ success: false, message: 'You have already rated this store' });
    }
    next(error);
  }
});


router.put('/:storeId/rating', authorize('NORMAL USER'), async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating must be 1-5' });

    const result = await pool.query(
      'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3',
      [rating, req.user.id, storeId]
    );

    if (result.rowCount === 0) return res.status(404).json({ success: false, message: 'Rating not found' });
    res.json({ success: true, message: 'Rating updated' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
