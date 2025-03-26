import { HomeScreenSelectors } from 'support/selectors';

describe('filters', () => {
  it('should apply filters', () => {
    cy.visit('/');

    cy.get(HomeScreenSelectors.Table).should('contain.text', '1974');

    cy.get(HomeScreenSelectors.FirstFilter).click().type('1974');
    cy.get(HomeScreenSelectors.SecondFilter).click().type('Q1');
    cy.get(HomeScreenSelectors.ThirdFilter).click().type('w4');

    cy.get(HomeScreenSelectors.Table).should('contain.text', '1974');

    cy.matchScreenshot('desktop-size');

    cy.viewport('iphone-8');

    cy.scrollTo('bottom');

    cy.matchScreenshot('mobile-size');
  });
});
