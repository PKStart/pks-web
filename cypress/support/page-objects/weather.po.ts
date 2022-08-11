export const weatherPo = {
  box: () => cy.get('pk-weather'),
  header: () => cy.get('pk-weather header'),
  actions: () => cy.get('pk-weather header .main-box-actions button'),
  closeBtn: () => cy.get('pk-weather header button[mattooltip="Close"]'),
  syncBtn: () => cy.get('pk-weather header button:first-child'),
}
