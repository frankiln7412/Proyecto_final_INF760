const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(overrides = {}) {
  const payload = {
    id: 1,
    rol: 'PROPIETARIO',
    correo: 'test@test.com',
    ...overrides,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'test_secret_key', { expiresIn: '1h' });
}

module.exports = { generateToken };
