export default {
  logo: () => cy.get('pk-logo'),
  emailInput: () => cy.get('input[name="auth-email"]'),
  getLoginCodeButton: () => cy.get('button[data-id="get-login-code-button"]'),
  haveLoginCodeLink: () => cy.get('a[data-id="have-login-code-link"]'),
  loginCodeInput: () => cy.get('input[name="auth-loginCode"]'),
  loginButton: () => cy.get('button[data-id="login-button"]'),
  needLoginCodeLink: () => cy.get('a[data-id="need-login-code-link"]'),
}
