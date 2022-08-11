import { birthdaysPo as po } from '../support/page-objects/birthdays.po'
import { appBarPo } from '../support/page-objects/main-layout.po'

describe('Birthdays', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Should inform the user that the service is not available', () => {
    appBarPo.birthdaysBtn().click()
    po.box().should('be.visible').should('contain', 'Birthdays are not available.')
    po.actions().should('have.length', 2)
    po.syncBtn().should('be.disabled')
  })
})
