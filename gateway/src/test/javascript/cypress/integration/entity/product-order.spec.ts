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

describe('ProductOrder e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load ProductOrders', () => {
    cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('ProductOrder').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details ProductOrder page', () => {
    cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('productOrder');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create ProductOrder page', () => {
    cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('ProductOrder');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit ProductOrder page', () => {
    cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('ProductOrder');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of ProductOrder', () => {
    cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('ProductOrder');

    cy.get(`[data-cy="placedDate"]`).type('2022-01-28T05:27').invoke('val').should('equal', '2022-01-28T05:27');

    cy.get(`[data-cy="status"]`).select('COMPLETED');

    cy.get(`[data-cy="invoiceId"]`).type('36395').should('have.value', '36395');

    cy.get(`[data-cy="code"]`)
      .type('Rupee Market plug-and-play', { force: true })
      .invoke('val')
      .should('match', new RegExp('Rupee Market plug-and-play'));

    cy.setFieldSelectToLastOfEntity('customer');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of ProductOrder', () => {
    cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/productorder/api/product-orders/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product-order');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('productOrder').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/productorder/api/product-orders*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('product-order');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
