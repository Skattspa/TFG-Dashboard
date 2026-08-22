describe('Flujo principal del Dashboard', () => {
  it('debe cargar la página inicial y mostrar el buscador', () => {
    cy.visit('/');
    cy.get('input[type="text"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Buscar').should('be.visible');
  });
});
