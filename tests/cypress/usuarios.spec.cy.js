describe('Usuarios - Administración (Rol: Propietario)', () => {
  beforeEach(() => {
    cy.visit('/login.html');
    cy.get('input[type="email"]').type('admin@patatas.com');
    cy.get('input[type="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
  });

  it('PT-CY-12: Debe mostrar lista de usuarios', () => {
    cy.visit('/app#usuarios');
    cy.get('table', { timeout: 10000 }).should('be.visible');
  });

  it('PT-CY-13: Debe tener columna de rol en la tabla', () => {
    cy.visit('/app#usuarios');
    cy.get('table thead th', { timeout: 10000 }).should('contain.text', 'Rol');
  });

  it('PT-CY-14: Debe tener modo oscuro disponible', () => {
    cy.get('.theme-toggle, #themeToggle, .dark-mode-btn', { timeout: 10000 }).should('be.visible');
  });

  it('PT-CY-15: Debe funcionar el toggle de modo oscuro', () => {
    cy.get('.theme-toggle, #themeToggle, .dark-mode-btn', { timeout: 10000 }).click();
    cy.get('body').should('have.attr', 'data-theme').and('match', /dark/);
  });
});
