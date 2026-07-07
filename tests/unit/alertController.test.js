jest.mock('../../src/config/db', () => {
  const { mockDb } = require('../helpers/mockDb');
  return mockDb;
});

const { mockQuery } = require('../helpers/mockDb');

describe('AlertController - Unit / Caja Blanca', () => {
  let alertController;
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../src/controllers/alertController')];
    alertController = require('../../src/controllers/alertController');
    req = { body: {}, params: {}, user: { id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('PT-AL-01: Listar alertas', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, mensaje: 'Stock bajo', estado: 'ACTIVA' }] });
    await alertController.getAlerts(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('PT-AL-02: Crear alerta', async () => {
    req.body = { producto_id: 1, mensaje: 'Stock crítico', estado: 'ACTIVA' };
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, mensaje: 'Stock crítico' }] });
    await alertController.createAlert(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('PT-AL-03: Eliminar alerta', async () => {
    req.params.id = '1';
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await alertController.deleteAlert(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Alerta eliminada correctamente' });
  });
});
