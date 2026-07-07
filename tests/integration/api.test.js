const request = require('supertest');
const app = require('../../src/app');
const { generateToken } = require('../helpers/mockToken');

let propietarioToken, empleadoToken;

beforeAll(() => {
  propietarioToken = generateToken({ id: 1, rol: 'PROPIETARIO', correo: 'admin@test.com' });
  empleadoToken = generateToken({ id: 2, rol: 'EMPLEADO', correo: 'emp@test.com' });
});

describe('API Integration - E2E Backend', () => {
  describe('Health Check', () => {
    test('PT-API-01: GET /api/health debe retornar 200', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('Auth - Login / Register', () => {
    test('PT-API-02: POST /api/auth/login sin datos devuelve 400', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
    });

    test('PT-API-03: POST /api/auth/login con credenciales inválidas devuelve 404', async () => {
      const res = await request(app).post('/api/auth/login').send({
        correo: 'noexiste@test.com',
        password: '123456',
      });
      expect(res.status).toBe(404);
    });

    test('PT-API-04: POST /api/auth/register sin datos devuelve 400', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
    });
  });

  describe('Security - Auth Middleware', () => {
    test('PT-API-05: GET /api/users sin token devuelve 401', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
    });

    test('PT-API-06: GET /api/products sin token devuelve 401', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(401);
    });

    test('PT-API-07: GET /api/sales/dashboard sin token devuelve 401', async () => {
      const res = await request(app).get('/api/sales/dashboard');
      expect(res.status).toBe(401);
    });

    test('PT-API-08: GET /api/sales/dashboard con token EMPLEADO devuelve 403 (RBAC)', async () => {
      const res = await request(app)
        .get('/api/sales/dashboard')
        .set('Authorization', `Bearer ${empleadoToken}`);
      expect(res.status).toBe(403);
    });

    test('PT-API-09: GET /api/sales/dashboard con token PROPIETARIO devuelve 200', async () => {
      const res = await request(app)
        .get('/api/sales/dashboard')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('Products API', () => {
    test('PT-API-10: GET /api/products con token válido devuelve 200', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('PT-API-11: POST /api/products con datos inválidos devuelve 400', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${propietarioToken}`)
        .send({ nombre: '', precio: 10, stock: 5, stock_minimo: 2 });
      expect(res.status).toBe(400);
    });

    test('PT-API-12: POST /api/products válido devuelve 201', async () => {
      const suffix = Date.now();
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${propietarioToken}`)
        .send({ nombre: `Producto Test API ${suffix}`, precio: 25, stock: 50, stock_minimo: 5 });
      expect(res.status).toBe(201);
    });

    test('PT-API-13: GET /api/products/:id inexistente devuelve 404', async () => {
      const res = await request(app)
        .get('/api/products/99999')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(404);
    });

    test('PT-API-14: DELETE /api/products/:id inexistente devuelve 404', async () => {
      const res = await request(app)
        .delete('/api/products/99999')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('Supplies API', () => {
    test('PT-API-15: GET /api/supplies devuelve 200', async () => {
      const res = await request(app)
        .get('/api/supplies')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });

    test('PT-API-16: POST /api/supplies con nombre vacío devuelve 400', async () => {
      const res = await request(app)
        .post('/api/supplies')
        .set('Authorization', `Bearer ${propietarioToken}`)
        .send({ nombre: '', cantidad: 10, unidad_medida: 'KG', precio: 5 });
      expect(res.status).toBe(400);
    });

    test('PT-API-17: POST /api/supplies válido devuelve 201', async () => {
      const suffix = Date.now();
      const res = await request(app)
        .post('/api/supplies')
        .set('Authorization', `Bearer ${propietarioToken}`)
        .send({ nombre: `Insumo Test API ${suffix}`, cantidad: 100, unidad_medida: 'UN', precio: 2.50 });
      expect(res.status).toBe(201);
    });
  });

  describe('Sales API', () => {
    test('PT-API-18: POST /api/sales sin datos devuelve 400', async () => {
      const res = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${propietarioToken}`)
        .send({});
      expect(res.status).toBe(400);
    });

    test('PT-API-19: GET /api/sales/reportes devuelve 200', async () => {
      const res = await request(app)
        .get('/api/sales/reportes')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });

    test('PT-API-20: GET /api/sales/libro-diario devuelve 200', async () => {
      const res = await request(app)
        .get('/api/sales/libro-diario')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });

    test('PT-API-21: GET /api/sales/libro-mensual devuelve 200', async () => {
      const res = await request(app)
        .get('/api/sales/libro-mensual')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });

    test('PT-API-22: GET /api/sales/por-cliente devuelve 200', async () => {
      const res = await request(app)
        .get('/api/sales/por-cliente?nombre=Juan')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('Repositions API', () => {
    test('PT-API-23: GET /api/repositions devuelve 200', async () => {
      const res = await request(app)
        .get('/api/repositions')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });

    test('PT-API-24: POST /api/repositions sin producto_id devuelve 400', async () => {
      const res = await request(app)
        .post('/api/repositions')
        .set('Authorization', `Bearer ${propietarioToken}`)
        .send({ cantidad: 50 });
      expect(res.status).toBe(400);
    });
  });

  describe('Proveedores API', () => {
    test('PT-API-25: GET /api/proveedores devuelve 200', async () => {
      const res = await request(app)
        .get('/api/proveedores')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });

    test('PT-API-26: POST /api/proveedores sin nombre devuelve 400', async () => {
      const res = await request(app)
        .post('/api/proveedores')
        .set('Authorization', `Bearer ${propietarioToken}`)
        .send({ contacto: 'Carlos' });
      expect(res.status).toBe(400);
    });
  });

  describe('Alerts API', () => {
    test('PT-API-27: GET /api/alerts devuelve 200', async () => {
      const res = await request(app)
        .get('/api/alerts')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });

    test('PT-API-28: POST /api/alerts sin producto_id devuelve 400', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${propietarioToken}`)
        .send({ mensaje: 'Test' });
      expect(res.status).toBe(400);
    });
  });

  describe('Inventory Movements API', () => {
    test('PT-API-29: GET /api/inventory-movements devuelve 200', async () => {
      const res = await request(app)
        .get('/api/inventory-movements')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });

    test('PT-API-30: GET /api/product-movements devuelve 200', async () => {
      const res = await request(app)
        .get('/api/product-movements')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('404 Route', () => {
    test('PT-API-31: GET /api/ruta-inexistente devuelve 404', async () => {
      const res = await request(app)
        .get('/api/ruta-inexistente')
        .set('Authorization', `Bearer ${propietarioToken}`);
      expect(res.status).toBe(404);
    });
  });
});
