describe('Flujo principal del Dashboard', () => {
  it('debe cargar la página inicial y mostrar el buscador', () => {
    // 1. El usuario entra a la raíz de la aplicación
    cy.visit('/');

    // 2. Comprobamos que el input del buscador está visible
    cy.get('input[type="text"]').should('be.visible');

    // 3. Comprobamos que el botón de buscar existe y contiene el texto correcto
    cy.get('button[type="submit"]').contains('Buscar').should('be.visible');
  });
});
