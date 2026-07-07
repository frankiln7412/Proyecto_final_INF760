jest.mock('../../src/config/db', () => {
  const { mockDb } = require('../helpers/mockDb');
  return mockDb;
});

const { mockQuery } = require('../helpers/mockDb');

describe('ProveedorController - Unit / Caja Blanca', () => {
  let proveedorController;
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../src/controllers/proveedorController')];
    proveedorController = require('../../src/controllers/proveedorController');
    req = { body: {}, params: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('PT-PROV-01: Listar proveedores', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Distribuidora ABC' }] });
    await proveedorController.getProveedores(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('PT-PROV-02: Crear proveedor correctamente (201)', async () => {
    req.body = { nombre: 'Distribuidora ABC', contacto: 'Carlos', telefono: '123456789' };
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Distribuidora ABC' }] });
    await proveedorController.createProveedor(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('PT-PROV-03: Rechazar proveedor sin nombre (400)', async () => {
    req.body = { contacto: 'Carlos' };
    await proveedorController.createProveedor(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('PT-PROV-04: Eliminar proveedor', async () => {
    req.params.id = '1';
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await proveedorController.deleteProveedor(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Proveedor eliminado correctamente' });
  });
});
