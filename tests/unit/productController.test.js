jest.mock('../../src/config/db', () => {
  const { mockDb } = require('../helpers/mockDb');
  return mockDb;
});

const { mockQuery } = require('../helpers/mockDb');

describe('ProductController - Unit / Caja Blanca', () => {
  let productController;
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../src/controllers/productController')];
    productController = require('../../src/controllers/productController');
    req = {
      body: {},
      params: {},
      user: { id: 1, rol: 'PROPIETARIO' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createProduct - Validaciones', () => {
    test('PT-PC-01: Debe rechazar si nombre está vacío (400)', async () => {
      req.body = { nombre: '', precio: 10, stock: 5, stock_minimo: 2 };
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El nombre del producto es obligatorio' });
    });

    test('PT-PC-02: Debe rechazar si precio es negativo (400)', async () => {
      req.body = { nombre: 'Test', precio: -1, stock: 5, stock_minimo: 2 };
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El precio debe ser un valor mayor o igual a 0' });
    });

    test('PT-PC-03: Debe rechazar si stock no es entero (400)', async () => {
      req.body = { nombre: 'Test', precio: 10, stock: 1.5, stock_minimo: 2 };
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-PC-04: Debe rechazar si stock es negativo (400)', async () => {
      req.body = { nombre: 'Test', precio: 10, stock: -5, stock_minimo: 2 };
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-PC-05: Debe crear producto correctamente (201)', async () => {
      req.body = { nombre: 'Papas Fritas', codigo: 'PAP-001', descripcion: 'Papas', precio: 15.50, stock: 100, stock_minimo: 10 };
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, nombre: 'Papas Fritas', codigo: 'PAP-001', precio: 15.50, stock: 100, stock_minimo: 10 }],
      });
      await productController.createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Producto creado correctamente' })
      );
    });
  });

  describe('updateProduct - Validaciones', () => {
    test('PT-PC-06: Debe rechazar si nombre está vacío en update (400)', async () => {
      req.body = { nombre: '' };
      req.params.id = '1';
      await productController.updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-PC-07: Debe rechazar precio negativo (400)', async () => {
      req.body = { precio: -10 };
      req.params.id = '1';
      await productController.updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('PT-PC-08: Debe actualizar producto correctamente', async () => {
      req.body = { nombre: 'Papas Actualizado', precio: 20, usuario_id: 1 };
      req.params.id = '1';
      mockQuery
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ id: 1, precio: 15.50, stock: 100 }] })
        .mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Papas Actualizado', precio: 20, stock: 100 }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});
      await productController.updateProduct(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Producto actualizado correctamente' })
      );
    });
  });

  describe('deleteProduct', () => {
    test('PT-PC-09: Debe eliminar producto correctamente', async () => {
      req.params.id = '1';
      mockQuery
        .mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Test', imagen: null }] })
        .mockResolvedValueOnce({ rowCount: 1 });
      await productController.deleteProduct(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Producto eliminado correctamente' });
    });

    test('PT-PC-10: Debe retornar 404 si producto no existe', async () => {
      req.params.id = '999';
      mockQuery
        .mockResolvedValueOnce({ rows: [{ id: 999, nombre: 'Test', imagen: null }] })
        .mockResolvedValueOnce({ rowCount: 0 });
      await productController.deleteProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getProducts / getProduct', () => {
    test('PT-PC-11: Debe listar productos correctamente', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Test', precio: 10 }] });
      await productController.getProducts(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    test('PT-PC-12: Debe retornar 404 si producto no existe', async () => {
      req.params.id = '999';
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await productController.getProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
