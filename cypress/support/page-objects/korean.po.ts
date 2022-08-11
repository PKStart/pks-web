export const koreanPo = {
  box: () => cy.get('pk-korean'),
  header: () => cy.get('pk-korean header'),
  actions: () => cy.get('pk-korean header .main-box-actions button'),
  closeBtn: () => cy.get('pk-korean header button[mattooltip="Close"]'),
  syncBtn: () => cy.get('pk-korean header button:first-child'),
}
