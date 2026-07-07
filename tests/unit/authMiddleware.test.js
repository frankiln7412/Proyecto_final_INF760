const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('AuthMiddleware - Caja Blanca', () => {
  let authMiddleware;
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../src/middlewares/auth')];
    authMiddleware = require('../../src/middlewares/auth');
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = 'test_secret';
  });

  test('PT-CM-01: Debe rechazar si no hay token (401)', () => {
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('PT-CM-02: Debe rechazar si el token no empieza con Bearer (401)', () => {
    req.headers.authorization = 'Invalid token123';
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
  });

  test('PT-CM-03: Debe rechazar token inválido (401)', () => {
    req.headers.authorization = 'Bearer token_invalido';
    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
  });

  test('PT-CM-04: Debe aceptar token válido y llamar next', () => {
    req.headers.authorization = 'Bearer token_valido';
    const decoded = { id: 1, rol: 'PROPIETARIO' };
    jwt.verify.mockReturnValue(decoded);
    authMiddleware(req, res, next);
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  test('PT-CM-05: Debe aceptar token de EMPLEADO correctamente', () => {
    req.headers.authorization = 'Bearer token_empleado';
    const decoded = { id: 2, rol: 'EMPLEADO' };
    jwt.verify.mockReturnValue(decoded);
    authMiddleware(req, res, next);
    expect(req.user.rol).toBe('EMPLEADO');
    expect(next).toHaveBeenCalled();
  });
});
