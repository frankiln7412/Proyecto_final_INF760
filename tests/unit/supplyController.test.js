jest.mock('../../src/config/db', () => {
  const { mockDb } = require('../helpers/mockDb');
  return mockDb;
});

const { mockQuery } = require('../helpers/mockDb');

describe('SupplyController - Unit / Caja Blanca', () => {
  let supplyController;
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../src/controllers/supplyController')];
    supplyController = require('../../src/controllers/supplyController');
    req = { body: {}, params: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('PT-SUP-01: Listar insumos', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Aceite', cantidad: 50 }] });
    await supplyController.getSupplies(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('PT-SUP-02: Obtener insumo por ID existente', async () => {
    req.params.id = '1';
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Aceite' }] });
    await supplyController.getSupply(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  test('PT-SUP-03: Retornar 404 si insumo no existe', async () => {
    req.params.id = '999';
    mockQuery.mockResolvedValueOnce({ rows: [] });
    await supplyController.getSupply(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('PT-SUP-04: Crear insumo correctamente', async () => {
    req.body = { nombre: 'Aceite Vegetal', cantidad: 100, unidad_medida: 'L', precio: 12.50 };
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Aceite Vegetal' }] });
    await supplyController.createSupply(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('PT-SUP-05: Eliminar insumo correctamente', async () => {
    req.params.id = '1';
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await supplyController.deleteSupply(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Insumo eliminado correctamente' });
  });
});
