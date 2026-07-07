describe('Caja Negra - Validación de Productos (Valores Límite)', () => {
  function validateProduct({ nombre, precio, stock, stock_minimo }) {
    const errors = [];
    if (!nombre || !nombre.trim()) errors.push('El nombre del producto es obligatorio');
    if (precio === undefined || precio === null || Number(precio) < 0) errors.push('El precio debe ser mayor o igual a 0');
    if (stock === undefined || stock === null || !Number.isInteger(Number(stock)) || Number(stock) < 0) errors.push('El stock debe ser un número entero mayor o igual a 0');
    if (stock_minimo === undefined || stock_minimo === null || !Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0) errors.push('El stock mínimo debe ser un número entero mayor o igual a 0');
    return { valid: errors.length === 0, errors };
  }

  test('CN-PROD-01: Producto válido', () => {
    const result = validateProduct({ nombre: 'Papas Fritas', precio: 15.50, stock: 100, stock_minimo: 10 });
    expect(result.valid).toBe(true);
  });

  test('CN-PROD-02: Nombre vacío -> inválido', () => {
    const result = validateProduct({ nombre: '', precio: 15, stock: 10, stock_minimo: 2 });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('El nombre del producto es obligatorio');
  });

  test('CN-PROD-03: Precio límite inferior 0 -> válido', () => {
    const result = validateProduct({ nombre: 'Test', precio: 0, stock: 10, stock_minimo: 2 });
    expect(result.valid).toBe(true);
  });

  test('CN-PROD-04: Precio negativo -0.01 -> inválido', () => {
    const result = validateProduct({ nombre: 'Test', precio: -0.01, stock: 10, stock_minimo: 2 });
    expect(result.valid).toBe(false);
  });

  test('CN-PROD-05: Stock límite inferior 0 -> válido', () => {
    const result = validateProduct({ nombre: 'Test', precio: 10, stock: 0, stock_minimo: 2 });
    expect(result.valid).toBe(true);
  });

  test('CN-PROD-06: Stock negativo -1 -> inválido', () => {
    const result = validateProduct({ nombre: 'Test', precio: 10, stock: -1, stock_minimo: 2 });
    expect(result.valid).toBe(false);
  });

  test('CN-PROD-07: Stock no entero 1.5 -> inválido', () => {
    const result = validateProduct({ nombre: 'Test', precio: 10, stock: 1.5, stock_minimo: 2 });
    expect(result.valid).toBe(false);
  });

  test('CN-PROD-08: Stock mínimo límite 0 -> válido', () => {
    const result = validateProduct({ nombre: 'Test', precio: 10, stock: 10, stock_minimo: 0 });
    expect(result.valid).toBe(true);
  });

  test('CN-PROD-09: Precio undefined -> inválido', () => {
    const result = validateProduct({ nombre: 'Test', precio: undefined, stock: 10, stock_minimo: 2 });
    expect(result.valid).toBe(false);
  });

  test('CN-PROD-10: Todos los campos null -> inválido', () => {
    const result = validateProduct({ nombre: null, precio: null, stock: null, stock_minimo: null });
    expect(result.valid).toBe(false);
  });
});

describe('Caja Negra - Validación de Ventas (Partición de Equivalencia)', () => {
  function validateSale({ total, items }) {
    const errors = [];
    if (total === undefined || total === null) errors.push('total es obligatorio');
    else if (Number(total) < 0) errors.push('El total no puede ser negativo');
    if (!Array.isArray(items) || items.length === 0) errors.push('Debe incluir al menos un producto');
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.producto_id) errors.push(`Item ${i}: producto_id obligatorio`);
        else {
          const cant = Number(item.cantidad);
          if (!Number.isInteger(cant) || cant <= 0) errors.push(`Item ${i}: cantidad inválida`);
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }

  test('CN-VENTA-01: Venta válida', () => {
    const result = validateSale({ total: 100, items: [{ producto_id: 1, cantidad: 2 }] });
    expect(result.valid).toBe(true);
  });

  test('CN-VENTA-02: Total negativo', () => {
    const result = validateSale({ total: -1, items: [{ producto_id: 1, cantidad: 2 }] });
    expect(result.valid).toBe(false);
  });

  test('CN-VENTA-03: Total cero -> válido (descuento 100%)', () => {
    const result = validateSale({ total: 0, items: [{ producto_id: 1, cantidad: 2 }] });
    expect(result.valid).toBe(true);
  });

  test('CN-VENTA-04: Items vacío', () => {
    const result = validateSale({ total: 100, items: [] });
    expect(result.valid).toBe(false);
  });

  test('CN-VENTA-05: Items no array', () => {
    const result = validateSale({ total: 100, items: 'invalido' });
    expect(result.valid).toBe(false);
  });

  test('CN-VENTA-06: Cantidad cero en item', () => {
    const result = validateSale({ total: 100, items: [{ producto_id: 1, cantidad: 0 }] });
    expect(result.valid).toBe(false);
  });

  test('CN-VENTA-07: Cantidad negativa en item', () => {
    const result = validateSale({ total: 100, items: [{ producto_id: 1, cantidad: -3 }] });
    expect(result.valid).toBe(false);
  });

  test('CN-VENTA-08: Cantidad decimal en item', () => {
    const result = validateSale({ total: 100, items: [{ producto_id: 1, cantidad: 2.5 }] });
    expect(result.valid).toBe(false);
  });

  test('CN-VENTA-09: Múltiples items válidos', () => {
    const result = validateSale({
      total: 200,
      items: [
        { producto_id: 1, cantidad: 2 },
        { producto_id: 2, cantidad: 5 },
      ],
    });
    expect(result.valid).toBe(true);
  });
});

describe('Caja Negra - Validación de Reposiciones (Partición de Equivalencia)', () => {
  function validateReposition({ producto_id, cantidad }) {
    const errors = [];
    if (!producto_id) errors.push('producto_id es obligatorio');
    if (cantidad === undefined || cantidad === null) errors.push('La cantidad es obligatoria');
    else if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) errors.push('La cantidad debe ser un número entero positivo');
    return { valid: errors.length === 0, errors };
  }

  test('CN-REP-01: Reposición válida', () => {
    expect(validateReposition({ producto_id: 1, cantidad: 50 }).valid).toBe(true);
  });

  test('CN-REP-02: Sin producto_id', () => {
    expect(validateReposition({ cantidad: 50 }).valid).toBe(false);
  });

  test('CN-REP-03: Cantidad límite 1 -> válido', () => {
    expect(validateReposition({ producto_id: 1, cantidad: 1 }).valid).toBe(true);
  });

  test('CN-REP-04: Cantidad cero -> inválido', () => {
    expect(validateReposition({ producto_id: 1, cantidad: 0 }).valid).toBe(false);
  });

  test('CN-REP-05: Cantidad negativa -> inválido', () => {
    expect(validateReposition({ producto_id: 1, cantidad: -10 }).valid).toBe(false);
  });
});
