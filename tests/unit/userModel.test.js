jest.mock('../../src/config/db', () => {
  const { mockDb } = require('../helpers/mockDb');
  return mockDb;
});

const { mockQuery } = require('../helpers/mockDb');

describe('UserModel - Unit / Caja Blanca', () => {
  let userModel;

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('../../src/models/userModel')];
    userModel = require('../../src/models/userModel');
  });

  test('PT-UM-01: createUser debe insertar y retornar usuario', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, nombre: 'Test', correo: 'test@test.com', rol: 'EMPLEADO' }],
    });
    const result = await userModel.createUser({ nombre: 'Test', correo: 'test@test.com', password: 'hash', rol: 'EMPLEADO' });
    expect(result.nombre).toBe('Test');
  });

  test('PT-UM-02: findByEmail debe retornar usuario si existe', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, correo: 'test@test.com' }] });
    const result = await userModel.findByEmail('test@test.com');
    expect(result.correo).toBe('test@test.com');
  });

  test('PT-UM-03: findByEmail debe retornar undefined si no existe', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const result = await userModel.findByEmail('noexiste@test.com');
    expect(result).toBeUndefined();
  });

  test('PT-UM-04: findById debe retornar usuario por ID', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Test' }] });
    const result = await userModel.findById(1);
    expect(result.id).toBe(1);
  });

  test('PT-UM-05: getAllUsers debe retornar lista', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'User1' }, { id: 2, nombre: 'User2' }] });
    const result = await userModel.getAllUsers();
    expect(result).toHaveLength(2);
  });

  test('PT-UM-06: updateUser debe retornar null sin campos', async () => {
    const result = await userModel.updateUser(1, {});
    expect(result).toBeNull();
  });

  test('PT-UM-07: updateUser debe actualizar usuario', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Updated', rol: 'PROPIETARIO' }] });
    const result = await userModel.updateUser(1, { nombre: 'Updated', rol: 'PROPIETARIO' });
    expect(result.nombre).toBe('Updated');
  });

  test('PT-UM-08: deleteUser debe retornar true si eliminó', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    const result = await userModel.deleteUser(1);
    expect(result).toBe(true);
  });

  test('PT-UM-09: deleteUser debe retornar false si no existe', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });
    const result = await userModel.deleteUser(999);
    expect(result).toBe(false);
  });
});
