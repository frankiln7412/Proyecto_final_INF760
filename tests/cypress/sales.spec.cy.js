describe('Ventas - Registro de venta (Rol: Propietario)', () => {
  beforeEach(() => {
    cy.visit('/login.html');
    cy.get('input[type="email"]').type('admin@patatas.com');
    cy.get('input[type="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
  });

  it('PT-CY-08: Debe mostrar formulario de venta con productos', () => {
    cy.visit('/app#ventas');
    cy.get('select, .product-select, #productoSelect', { timeout: 10000 }).should('exist');
  });

  it('PT-CY-09: Debe mostrar reporte de ventas con filtro de fechas', () => {
    cy.visit('/app#ventas');
    cy.get('input[type="date"]', { timeout: 10000 }).should('have.length.at.least', 2);
  });
});
