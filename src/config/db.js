const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('PostgreSQL conectado correctamente');
    return result.rows[0];
  } catch (error) {
    console.error('No se pudo conectar a PostgreSQL:', error.message);
    throw error;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection,
};
