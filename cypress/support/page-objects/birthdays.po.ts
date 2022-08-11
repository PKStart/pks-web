export const birthdaysPo = {
  box: () => cy.get('pk-birthdays'),
  header: () => cy.get('pk-birthdays header'),
  actions: () => cy.get('pk-birthdays header .main-box-actions button'),
  closeBtn: () => cy.get('pk-birthdays header button[mattooltip="Close"]'),
  syncBtn: () => cy.get('pk-birthdays header button:first-child'),
}
