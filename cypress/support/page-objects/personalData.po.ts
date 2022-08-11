export const personalDataPo = {
  box: () => cy.get('pk-personal-data'),
  header: () => cy.get('pk-personal-data header'),
  actions: () => cy.get('pk-personal-data header .main-box-actions button'),
  closeBtn: () => cy.get('pk-personal-data header button[mattooltip="Close"]'),
  addNewBtn: () => cy.get('pk-personal-data header button[mattooltip="Add new"]'),
  searchInput: () => cy.get('pk-personal-data input.search-input'),
  searchBtn: () => cy.get('pk-personal-data button.search-btn'),
  cards: () => cy.get('pk-personal-data-card'),
  card: {
    card: (i: number) => cy.get('pk-personal-data-card mat-card').eq(i),
    title: (i: number) => cy.get('pk-personal-data-card mat-card header h1').eq(i),
    actions: (i: number) =>
      cy.get(`pk-personal-data-card:nth-of-type(${i + 1}) mat-card header .actions button`),
    copyBtn: (i: number) =>
      cy.get(
        `pk-personal-data-card:nth-of-type(${i + 1}) mat-card header .actions button:first-child`
      ),
    editBtn: (i: number) =>
      cy.get(
        `pk-personal-data-card:nth-of-type(${i + 1}) mat-card header .actions button:nth-child(2)`
      ),
    deleteBtn: (i: number) =>
      cy.get(
        `pk-personal-data-card:nth-of-type(${i + 1}) mat-card header .actions button:last-child`
      ),
    content: (i: number) => cy.get(`pk-personal-data-card:nth-of-type(${i + 1}) mat-card p`),
  },
  personalDataDialog: {
    dialog: () => cy.get('pk-personal-data-dialog'),
    title: () => cy.get('pk-personal-data-dialog h1'),
    nameInput: () => cy.get('pk-personal-data-dialog input[formcontrolname="name"]'),
    identifierInput: () => cy.get('pk-personal-data-dialog input[formcontrolname="identifier"]'),
    expiryInput: () => cy.get('pk-personal-data-dialog input[formcontrolname="expiry"]'),
    closeBtn: () => cy.get('pk-personal-data-dialog .mat-dialog-actions button:first-child'),
    saveBtn: () => cy.get('pk-personal-data-dialog .mat-dialog-actions button:last-child'),
  },
}
