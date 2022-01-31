import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Customer e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Customers', () => {
    cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Customer').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Customer page', () => {
    cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('customer');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Customer page', () => {
    cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Customer');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Customer page', () => {
    cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Customer');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Customer', () => {
    cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Customer');

    cy.get(`[data-cy="userId"]`).type('70762').should('have.value', '70762');

    cy.get(`[data-cy="firstName"]`).type('Oral', { force: true }).invoke('val').should('match', new RegExp('Oral'));

    cy.get(`[data-cy="lastName"]`).type('Wintheiser', { force: true }).invoke('val').should('match', new RegExp('Wintheiser'));

    cy.get(`[data-cy="gender"]`).select('FEMALE');

    cy.get(`[data-cy="email"]`)
      .type('Kathleen23@gmail.com', { force: true })
      .invoke('val')
      .should('match', new RegExp('Kathleen23@gmail.com'));

    cy.get(`[data-cy="phone"]`)
      .type('1-451-612-1180 x048', { force: true })
      .invoke('val')
      .should('match', new RegExp('1-451-612-1180 x048'));

    cy.get(`[data-cy="addressLine1"]`)
      .type('Switzerland Buckinghamshire multi-byte', { force: true })
      .invoke('val')
      .should('match', new RegExp('Switzerland Buckinghamshire multi-byte'));

    cy.get(`[data-cy="addressLine2"]`).type('matrix back', { force: true }).invoke('val').should('match', new RegExp('matrix back'));

    cy.get(`[data-cy="city"]`).type('Treutelton', { force: true }).invoke('val').should('match', new RegExp('Treutelton'));

    cy.get(`[data-cy="country"]`).type('Gabon', { force: true }).invoke('val').should('match', new RegExp('Gabon'));

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Customer', () => {
    cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/productorder/api/customers/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('customer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/productorder/api/customers*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('customer');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
