describe('normalizeDateParam - Caja Blanca', () => {
  function normalizeDateParam(dateStr, endOfDay = false) {
    if (!dateStr) return null;
    if (dateStr.includes('T')) return dateStr;
    return `${dateStr}${endOfDay ? 'T23:59:59' : 'T00:00:00'}`;
  }

  test('PT-ND-01: Debe retornar null si dateStr es null', () => {
    expect(normalizeDateParam(null)).toBeNull();
  });

  test('PT-ND-02: Debe retornar null si dateStr es undefined', () => {
    expect(normalizeDateParam(undefined)).toBeNull();
  });

  test('PT-ND-03: Debe agregar T00:00:00 para inicio del día', () => {
    expect(normalizeDateParam('2026-07-06')).toBe('2026-07-06T00:00:00');
  });

  test('PT-ND-04: Debe agregar T23:59:59 para fin del día', () => {
    expect(normalizeDateParam('2026-07-06', true)).toBe('2026-07-06T23:59:59');
  });

  test('PT-ND-05: Debe retornar igual si ya incluye T', () => {
    expect(normalizeDateParam('2026-07-06T15:30:00')).toBe('2026-07-06T15:30:00');
  });

  test('PT-ND-06: Debe retornar igual si ya incluye T con endOfDay', () => {
    expect(normalizeDateParam('2026-07-06T15:30:00', true)).toBe('2026-07-06T15:30:00');
  });
});

describe('Caja Negra - Valores Límite para fechas', () => {
  function isValidDateRange(desde, hasta) {
    if (!desde && !hasta) return true;
    if (desde && hasta) {
      const d1 = new Date(desde);
      const d2 = new Date(hasta);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
      return d1 <= d2;
    }
    return true;
  }

  test('CN-FECHA-01: Fechas válidas desde <= hasta', () => {
    expect(isValidDateRange('2026-01-01', '2026-12-31')).toBe(true);
  });

  test('CN-FECHA-02: Fechas iguales', () => {
    expect(isValidDateRange('2026-07-06', '2026-07-06')).toBe(true);
  });

  test('CN-FECHA-03: desde > hasta debe ser inválido', () => {
    expect(isValidDateRange('2026-12-31', '2026-01-01')).toBe(false);
  });

  test('CN-FECHA-04: Formato inválido undefined', () => {
    expect(isValidDateRange(undefined, undefined)).toBe(true);
  });

  test('CN-FECHA-05: Formato inválido "no-es-fecha"', () => {
    expect(isValidDateRange('no-es-fecha', '2026-07-06')).toBe(false);
  });
});
