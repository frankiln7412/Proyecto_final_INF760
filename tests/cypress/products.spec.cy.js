describe('Productos - CRUD (Rol: Propietario)', () => {
  beforeEach(() => {
    cy.visit('/login.html');
    cy.get('input[type="email"]').type('admin@patatas.com');
    cy.get('input[type="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
  });

  it('PT-CY-06: Debe navegar a productos y listar tabla', () => {
    cy.visit('/app#productos');
    cy.get('table', { timeout: 10000 }).should('be.visible');
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
  });

  it('PT-CY-07: Debe mostrar el modal de crear producto', () => {
    cy.visit('/app#productos');
    cy.get('button:contains("Nuevo"), a:contains("Nuevo"), .btn-primary', { timeout: 10000 }).first().click();
    cy.get('.modal', { timeout: 5000 }).should('be.visible');
  });
});
