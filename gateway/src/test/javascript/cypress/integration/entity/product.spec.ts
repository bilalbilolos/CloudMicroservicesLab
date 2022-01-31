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

describe('Product e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Products', () => {
    cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Product').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Product page', () => {
    cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('product');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Product page', () => {
    cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Product');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Product page', () => {
    cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Product');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Product', () => {
    cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Product');

    cy.get(`[data-cy="sku"]`)
      .type('Steel Investor Ergonomic', { force: true })
      .invoke('val')
      .should('match', new RegExp('Steel Investor Ergonomic'));

    cy.get(`[data-cy="upc"]`).type('reboot', { force: true }).invoke('val').should('match', new RegExp('reboot'));

    cy.get(`[data-cy="name"]`)
      .type('Gorgeous target parsing', { force: true })
      .invoke('val')
      .should('match', new RegExp('Gorgeous target parsing'));

    cy.get(`[data-cy="description"]`)
      .type('../fake-data/blob/hipster.txt', { force: true })
      .invoke('val')
      .should('match', new RegExp('../fake-data/blob/hipster.txt'));

    cy.get(`[data-cy="price"]`).type('68534').should('have.value', '68534');

    cy.get(`[data-cy="productSize"]`).select('M');

    cy.get(`[data-cy="colors"]`).type('rvyu,a,fg,mlr,tol', { force: true }).invoke('val').should('match', new RegExp('rvyu,a,fg,mlr,tol'));

    cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

    cy.get(`[data-cy="imageCdnUrl"]`).type('Producer', { force: true }).invoke('val').should('match', new RegExp('Producer'));

    cy.get(`[data-cy="thumbnailCdnUrl"]`)
      .type('Cambridgeshire', { force: true })
      .invoke('val')
      .should('match', new RegExp('Cambridgeshire'));

    cy.setFieldSelectToLastOfEntity('productCategory');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Product', () => {
    cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/productorder/api/products/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('product');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('product').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/productorder/api/products*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('product');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
