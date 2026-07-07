describe('Proveedores - CRUD', () => {
  beforeEach(() => {
    cy.visit('/login.html');
    cy.get('input[type="email"]').type('admin@patatas.com');
    cy.get('input[type="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
  });

  it('PT-CY-10: Debe listar proveedores en tabla', () => {
    cy.visit('/app#proveedores');
    cy.get('table', { timeout: 10000 }).should('be.visible');
  });

  it('PT-CY-11: Debe tener botón para crear proveedor', () => {
    cy.visit('/app#proveedores');
    cy.get('button:contains("Nuevo"), .btn-primary', { timeout: 10000 }).should('be.visible');
  });
});
