jest.mock('../../src/config/db', () => {
  const { mockDb } = require('../helpers/mockDb');
  return mockDb;
});

const { mockQuery } = require('../helpers/mockDb');

describe('SaleController - Unit / Caja Blanca', () => {
  let saleController;
  let req, res;

  beforeAll(() => {
    saleController = require('../../src/controllers/saleController');
  });

  beforeEach(() => {
    mockQuery.mockReset();
    req = {
      body: {},
      query: {},
      params: {},
      user: { id: 1, rol: 'PROPIETARIO' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createSale - Validaciones', () => {
    test('PT-SC-01: Debe rechazar si total es undefined (400)', async () => {
      req.body = { items: [] };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'total es obligatorio' });
    });

    test('PT-SC-02: Debe rechazar total negativo (400)', async () => {
      req.body = { total: -50, items: [{ producto_id: 1, cantidad: 1 }] };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El total no puede ser negativo' });
    });

    test('PT-SC-03: Debe rechazar si items no es array (400)', async () => {
      req.body = { total: 100, items: 'invalido' };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-SC-04: Debe rechazar si items está vacío (400)', async () => {
      req.body = { total: 100, items: [] };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-SC-05: Debe rechazar item sin producto_id (400)', async () => {
      req.body = { total: 100, items: [{ cantidad: 2 }] };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-SC-06: Debe rechazar item con cantidad no entera (400)', async () => {
      req.body = { total: 100, items: [{ producto_id: 1, cantidad: 1.5 }] };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-SC-07: Debe rechazar item con cantidad cero (400)', async () => {
      req.body = { total: 100, items: [{ producto_id: 1, cantidad: 0 }] };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-SC-08: Debe rechazar item con cantidad negativa (400)', async () => {
      req.body = { total: 100, items: [{ producto_id: 1, cantidad: -3 }] };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-SC-09: Debe rechazar precio_unitario negativo (400)', async () => {
      req.body = { total: 100, items: [{ producto_id: 1, cantidad: 2, precio_unitario: -10 }] };
      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-SC-10: Debe crear venta correctamente (201)', async () => {
      req.body = {
        total: 31,
        items: [{ producto_id: 1, cantidad: 2, precio_unitario: 15.50, subtotal: 31 }],
        metodo_pago: 'QR',
        cliente_nombre: 'Juan Perez',
      };

      mockQuery
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Papas', precio: 15.50, stock: 100, stock_minimo: 10 }] })
        .mockResolvedValueOnce({ rows: [{ id: 1, usuario_id: 1, total: 31, metodo_pago: 'QR', fecha: new Date(), cliente_nombre: 'Juan Perez' }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ stock: 98, stock_minimo: 10, nombre: 'Papas' }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({});

      await saleController.createSale(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Venta registrada correctamente' })
      );
    });
  });

  describe('getSalesByClient', () => {
    test('PT-SC-11: Debe retornar array vacío si nombre vacío', async () => {
      req.query = { nombre: '' };
      await saleController.getSalesByClient(req, res);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    test('PT-SC-12: Debe buscar ventas por cliente', async () => {
      req.query = { nombre: 'Juan' };
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, fecha: new Date(), total: 100, metodo_pago: 'EFECTIVO', cliente_nombre: 'Juan Perez', usuario: 'Admin' }],
      });
      await saleController.getSalesByClient(req, res);
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('getLibroDiario / getLibroMensual', () => {
    test('PT-SC-13: Debe obtener libro diario', async () => {
      req.query = { fecha: '2026-07-06' };
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await saleController.getLibroDiario(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ fecha: '2026-07-06' })
      );
    });

    test('PT-SC-14: Debe obtener libro mensual', async () => {
      req.query = { mes: '7', anio: '2026' };
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await saleController.getLibroMensual(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mes: '7', anio: '2026' })
      );
    });
  });
});
