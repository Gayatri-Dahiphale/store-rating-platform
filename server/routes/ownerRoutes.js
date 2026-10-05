const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('STORE OWNER'));

router.get('/dashboard', async (req, res, next) => {
  try {
    // Get all stores owned by this user
    const storesResult = await pool.query(`
      SELECT s.id, s.name, s.address,
        COUNT(r.id)::int AS rating_count,
        COALESCE(AVG(r.rating), 0)::numeric(10,2) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id
      ORDER BY s.name ASC
    `, [req.user.id]);

    // For each store, get the list of users who rated it
    const stores = await Promise.all(
      storesResult.rows.map(async (store) => {
        const ratingsResult = await pool.query(`
          SELECT u.id, u.name, u.email, r.rating, r.created_at
          FROM ratings r
          JOIN users u ON r.user_id = u.id
          WHERE r.store_id = $1
          ORDER BY r.created_at DESC
        `, [store.id]);

        return { ...store, users: ratingsResult.rows };
      })
    );

    res.json({ success: true, data: stores });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
