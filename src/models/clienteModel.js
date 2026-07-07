const db = require('../config/db');

async function findByCI(ci) {
  const result = await db.query(
    'SELECT id, ci, nombre, created_at FROM cliente WHERE ci = $1',
    [ci]
  );
  return result.rows[0] || null;
}

async function create({ ci, nombre }) {
  const result = await db.query(
    'INSERT INTO cliente (ci, nombre) VALUES ($1, $2) RETURNING id, ci, nombre, created_at',
    [ci, nombre]
  );
  return result.rows[0];
}

async function searchByNombre(nombre) {
  const result = await db.query(
    'SELECT id, ci, nombre, created_at FROM cliente WHERE nombre ILIKE $1 ORDER BY nombre ASC LIMIT 20',
    [`%${nombre}%`]
  );
  return result.rows;
}

module.exports = { findByCI, create, searchByNombre };
