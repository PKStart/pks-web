import { koreanPo as po } from '../support/page-objects/korean.po'
import { appBarPo } from '../support/page-objects/main-layout.po'

describe('Korean', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Should inform the user that the service is not available', () => {
    appBarPo.koreanBtn().click()
    po.box().should('be.visible').should('contain', 'Korean word list is not available.')
    po.actions().should('have.length', 2)
    po.syncBtn().should('be.disabled')
  })
})
