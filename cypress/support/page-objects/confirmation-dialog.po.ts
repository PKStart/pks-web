export const confirmationDialogPo = {
  dialog: () => cy.get('pk-confirmation-dialog'),
  cancelBtn: () => cy.get('button[data-test-id="confirmation-cancel-btn"]'),
  okBtn: () => cy.get('button[data-test-id="confirmation-ok-btn"]'),
}
