describe('Login - Pantalla de inicio de sesión', () => {
  beforeEach(() => {
    cy.visit('/login.html');
  });

  it('PT-CY-01: Debe renderizar el formulario de login correctamente', () => {
    cy.get('form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('PT-CY-02: Debe mostrar error con credenciales vacías', () => {
    cy.get('button[type="submit"]').click();
    cy.get('.alert, .error, .message').should('be.visible');
  });

  it('PT-CY-03: Debe mostrar error con credenciales inválidas', () => {
    cy.get('input[type="email"]').type('invalido@test.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.get('.alert, .error, .message', { timeout: 5000 }).should('be.visible');
  });
});
