const pool = require('./db');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const seed = async () => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    

    await pool.query('DROP TABLE IF EXISTS ratings, stores, users CASCADE;');
    

    await pool.query(schema);
    
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const userHash = await bcrypt.hash('User@123', 10);
    const ownerHash = await bcrypt.hash('Owner@123', 10);


    const usersRes = await pool.query(`
      INSERT INTO users (name, email, password_hash, address, role)
      VALUES 
      ('Admin User', 'admin@example.com', $1, 'Admin Address, 123 Main St', 'SYSTEM ADMINISTRATOR'),
      ('Normal User 1', 'user@example.com', $2, 'User Address 1', 'NORMAL USER'),
      ('Normal User 2', 'user2@example.com', $2, 'User Address 2', 'NORMAL USER'),
      ('Normal User 3', 'user3@example.com', $2, 'User Address 3', 'NORMAL USER'),
      ('Store Owner 1', 'owner@example.com', $3, 'Owner Address 1', 'STORE OWNER'),
      ('Store Owner 2', 'owner2@example.com', $3, 'Owner Address 2', 'STORE OWNER')
      RETURNING id, role;
    `, [adminHash, userHash, ownerHash]);

    const users = usersRes.rows;
    const owners = users.filter(u => u.role === 'STORE OWNER');
    const normalUsers = users.filter(u => u.role === 'NORMAL USER');


    const storesRes = await pool.query(`
      INSERT INTO stores (name, email, address, owner_id)
      VALUES 
      ('Super Store A', 'storeA@example.com', 'Store A Address', $1),
      ('Mega Store B', 'storeB@example.com', 'Store B Address', $1),
      ('Ultra Store C', 'storeC@example.com', 'Store C Address', $2)
      RETURNING id;
    `, [owners[0].id, owners[1].id]);

    const stores = storesRes.rows;


    await pool.query(`
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES 
      ($1, $4, 4),
      ($2, $4, 5),
      ($3, $4, 3),
      ($1, $5, 2),
      ($2, $6, 5)
    `, [normalUsers[0].id, normalUsers[1].id, normalUsers[2].id, stores[0].id, stores[1].id, stores[2].id]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
