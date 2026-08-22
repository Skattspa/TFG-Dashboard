describe('Dashboard Meteorológico - Pruebas E2E y Resiliencia', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:3000/api/weather*').as('initialLoad');
    cy.visit('http://localhost:4200');
    cy.wait('@initialLoad');
  });

  // -------------------------------------------------------------------------
  // 1. Navegación y Enrutamiento
  // -------------------------------------------------------------------------
  it('Debe transicionar a Detail Forecast y montar los gráficos de ng2-charts sin excepciones', () => {
    cy.get('[data-cy="metric-card-temperature"]').find('a.details-link').click();
    cy.url().should('include', '/details/temperatura');
    cy.get('[data-cy="details-loading"]').should('not.exist');
    cy.get('[data-cy="details-title"]').should('be.visible').and('not.be.empty');
    cy.get('[data-cy="chart-container"] canvas').should('be.visible');
    cy.get('[data-cy="back-button"]').click();
    cy.url().should('not.include', '/details');
  });

  // -------------------------------------------------------------------------
  // 2. Flujo Asíncrono de Búsqueda
  // -------------------------------------------------------------------------
  it('Debe mostrar estados de carga y actualizar los datos asíncronos tras la búsqueda', () => {
    const targetCity = 'Madrid';
    cy.intercept('GET', 'http://localhost:3000/api/weather*', (req) => {
      return Cypress.Promise.delay(2000).then(() => {
        req.continue();
      });
    }).as('getWeatherData');

    // Lanzamos la búsqueda
    cy.get('[data-cy="search-input"]').clear().type(`${targetCity}{enter}`);
    cy.get('[data-cy="loading-state"]').should('be.visible').and('contain', '⏳');

    cy.get('[data-cy="search-button"]').should('be.disabled');
    cy.wait('@getWeatherData');
    cy.get('[data-cy="loading-state"]').should('not.exist');
    cy.get('[data-cy="search-button"]').should('not.be.disabled');
    cy.get('[data-cy="current-city-name"]').should('contain', targetCity);
    cy.get('[data-cy="metric-card-temperature"]').should('be.visible');
  });

  // -------------------------------------------------------------------------
  // 3. Resiliencia de Red e Interceptación (Mocking HTTP 500)
  // -------------------------------------------------------------------------
  it('Debe capturar caídas del servidor mostrando una alerta', () => {
    cy.intercept('GET', 'http://localhost:3000/api/weather*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
      delay: 3000,
    }).as('getServerFailure');
    cy.get('[data-cy="search-input"]').clear().type('Atlantis{enter}');
    cy.wait('@getServerFailure');
    cy.get('[data-cy="error-alert"]').should('be.visible');
    cy.get('[data-cy="search-input"]').should('be.visible').and('not.be.disabled');
  });
});
