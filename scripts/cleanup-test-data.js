const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  await pool.query("DELETE FROM producto WHERE nombre LIKE 'Producto Test API %'");
  await pool.query("DELETE FROM insumo WHERE nombre LIKE 'Insumo Test API %'");
  console.log('Cleanup done');
  await pool.end();
}

main().catch(console.error);
