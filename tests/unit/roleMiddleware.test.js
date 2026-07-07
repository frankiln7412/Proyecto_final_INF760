describe('RoleMiddleware - Caja Blanca', () => {
  let authorizeRoles;
  let req, res, next;

  beforeEach(() => {
    delete require.cache[require.resolve('../../src/middlewares/role')];
    authorizeRoles = require('../../src/middlewares/role');
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('PT-RM-01: Debe rechazar si no hay usuario autenticado (401)', () => {
    const middleware = authorizeRoles('PROPIETARIO');
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No autenticado' });
  });

  test('PT-RM-02: Debe rechazar si el rol no está autorizado (403)', () => {
    req.user = { id: 1, rol: 'EMPLEADO' };
    const middleware = authorizeRoles('PROPIETARIO');
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'No tienes permisos para realizar esta acción' });
  });

  test('PT-RM-03: Debe aceptar si el rol está autorizado', () => {
    req.user = { id: 1, rol: 'PROPIETARIO' };
    const middleware = authorizeRoles('PROPIETARIO');
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('PT-RM-04: Debe aceptar con múltiples roles permitidos', () => {
    req.user = { id: 2, rol: 'EMPLEADO' };
    const middleware = authorizeRoles('PROPIETARIO', 'EMPLEADO');
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
