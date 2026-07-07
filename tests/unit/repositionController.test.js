jest.mock('../../src/config/db', () => {
  const { mockDb } = require('../helpers/mockDb');
  return mockDb;
});

const { mockQuery, mockClient } = require('../helpers/mockDb');

describe('RepositionController - Unit / Caja Blanca', () => {
  let repositionController;
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../src/controllers/repositionController')];
    repositionController = require('../../src/controllers/repositionController');
    req = { body: {}, params: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('PT-REP-01: Listar reposiciones', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, producto_nombre: 'Papas', cantidad: 50, usuario_nombre: 'Admin', proveedor_nombre: 'Prov' }],
    });
    await repositionController.getRepositions(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('PT-REP-02: Crear reposición correctamente', async () => {
    req.body = { producto_id: 1, cantidad: 50, proveedor_id: 1 };

    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Papas', stock: 10 }] }) // SELECT FOR UPDATE
      .mockResolvedValueOnce({ rows: [{ id: 1, producto_id: 1, cantidad: 50 }] }) // INSERT reposicion
      .mockResolvedValueOnce({}) // UPDATE producto stock
      .mockResolvedValueOnce({}) // INSERT movimiento
      .mockResolvedValueOnce({}); // COMMIT

    await repositionController.createReposition(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('PT-REP-03: Rechazar reposición sin producto_id (400)', async () => {
    req.body = { cantidad: 50 };
    await repositionController.createReposition(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('PT-REP-04: Rechazar reposición con cantidad no positiva (400)', async () => {
    req.body = { producto_id: 1, cantidad: -5 };
    await repositionController.createReposition(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
