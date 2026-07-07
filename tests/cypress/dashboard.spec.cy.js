describe('Dashboard - Panel principal (Rol: Propietario)', () => {
  beforeEach(() => {
    cy.visit('/login.html');
    cy.get('input[type="email"]').type('admin@patatas.com');
    cy.get('input[type="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 5000 }).should('include', '/app');
  });

  it('PT-CY-04: Debe mostrar el dashboard con KPI cards', () => {
    cy.visit('/app');
    cy.get('.kpi-card, .card', { timeout: 10000 }).should('have.length.at.least', 3);
  });

  it('PT-CY-05: Debe mostrar el Stock Pulse', () => {
    cy.get('#stockPulse, .stock-pulse', { timeout: 10000 }).should('be.visible');
  });
});
