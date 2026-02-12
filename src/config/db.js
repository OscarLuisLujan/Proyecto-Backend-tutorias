const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false,
});

const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión a PostgreSQL establecida');
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL');
    console.error(error.message);
    process.exit(1); // mata la app (esto es CORRECTO)
  }
};

module.exports = {
  pool,
  connectDB,
};
