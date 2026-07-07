jest.mock('../../src/config/db', () => {
  const { mockDb } = require('../helpers/mockDb');
  return mockDb;
});

const { mockQuery } = require('../helpers/mockDb');

describe('AuthController - Unit / Caja Blanca', () => {
  let authController;
  let req, res;
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../src/controllers/authController')];
    authController = require('../../src/controllers/authController');
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('register', () => {
    test('PT-AC-01: Debe rechazar si faltan campos (400)', async () => {
      req.body = { nombre: 'Test' };
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-AC-02: Debe rechazar si correo ya existe (409)', async () => {
      req.body = { nombre: 'Test', correo: 'test@test.com', password: '123456' };
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
    });

    test('PT-AC-03: Debe registrar usuario correctamente (201)', async () => {
      req.body = { nombre: 'Nuevo Usuario', correo: 'nuevo@test.com', password: '123456', rol: 'EMPLEADO' };

      mockQuery
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: 2, nombre: 'Nuevo Usuario', correo: 'nuevo@test.com', rol: 'EMPLEADO' }] });

      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('login', () => {
    test('PT-AC-04: Debe rechazar si faltan credenciales (400)', async () => {
      req.body = { correo: 'test@test.com' };
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-AC-05: Debe rechazar usuario no encontrado (404)', async () => {
      req.body = { correo: 'noexiste@test.com', password: '123456' };
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('PT-AC-06: Debe rechazar contraseña incorrecta (401)', async () => {
      req.body = { correo: 'test@test.com', password: 'wrongpass' };
      const bcryptCompare = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, nombre: 'Test', correo: 'test@test.com', password: '$2a$10$hash', rol: 'PROPIETARIO' }],
      });
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      bcryptCompare.mockRestore();
    });

    test('PT-AC-07: Debe iniciar sesión correctamente (200)', async () => {
      req.body = { correo: 'admin@test.com', password: 'admin123' };

      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, nombre: 'Admin', correo: 'admin@test.com', password: '$2a$10$hash', rol: 'PROPIETARIO' }],
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue('token_generado');

      await authController.login(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Login correcto', token: 'token_generado' })
      );

      bcrypt.compare.mockRestore();
      jwt.sign.mockRestore();
    });
  });
});
