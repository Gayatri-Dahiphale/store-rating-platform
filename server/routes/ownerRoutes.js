const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.use(authorize('STORE OWNER'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const storesResult = await pool.query(`
      SELECT s.id, s.name, s.address,
      COUNT(r.id) as rating_count,
      COALESCE(AVG(r.rating), 0)::numeric(10,2) as average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id
    `, [req.user.id]);

    const dashboardData = await Promise.all(storesResult.rows.map(async (store) => {
      const usersResult = await pool.query(`
        SELECT u.id, u.name, u.email, r.rating, r.created_at
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        WHERE r.store_id = $1
        ORDER BY r.created_at DESC
      `, [store.id]);

      return {
        ...store,
        rating_count: parseInt(store.rating_count),
        users: usersResult.rows
      };
    }));

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
