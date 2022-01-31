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

describe('Notification e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Notifications', () => {
    cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Notification').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Notification page', () => {
    cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('notification');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Notification page', () => {
    cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Notification');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Notification page', () => {
    cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Notification');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Notification', () => {
    cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Notification');

    cy.get(`[data-cy="date"]`).type('2022-01-28T06:41').invoke('val').should('equal', '2022-01-28T06:41');

    cy.get(`[data-cy="details"]`).type('Greece', { force: true }).invoke('val').should('match', new RegExp('Greece'));

    cy.get(`[data-cy="sentDate"]`).type('2022-01-28T13:13').invoke('val').should('equal', '2022-01-28T13:13');

    cy.get(`[data-cy="format"]`).select('SMS');

    cy.get(`[data-cy="userId"]`).type('26553').should('have.value', '26553');

    cy.get(`[data-cy="productId"]`).type('56538').should('have.value', '56538');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Notification', () => {
    cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/notification/api/notifications/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('notification');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('notification').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/notification/api/notifications*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('notification');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
