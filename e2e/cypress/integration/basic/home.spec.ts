import { HomeScreenSelectors } from 'support/selectors';

describe('basic', () => {
  it('should load home screen', () => {
    cy.visit('/');

    cy.get(HomeScreenSelectors.Table).should('contain.text', '1974');

    cy.matchScreenshot('desktop-size');

    cy.viewport('iphone-8');
    cy.matchScreenshot('mobile-size');
  });
});
