// config/db.js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;


const isLocalDatabase = process.env.DATABASE_URL && (
    process.env.DATABASE_URL.includes('localhost') || 
    process.env.DATABASE_URL.includes('127.0.0.1')
);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalDatabase ? false : { rejectUnauthorized: false } 
});

//Testing Connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully (from db.js):', res.rows[0].now);
  }
});


export default pool; 


 export async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing DB:', error);
    process.exit(1); // Exit with failure
  }
};
