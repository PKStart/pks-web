import { weatherPo as po } from '../support/page-objects/weather.po'
import { appBarPo } from '../support/page-objects/main-layout.po'

describe('Weather', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Should inform the user that the service is not available', () => {
    appBarPo.weatherBtn().click()
    po.box().should('be.visible').should('contain', 'Weather service is not available.')
    po.actions().should('have.length', 2)
    po.syncBtn().should('be.disabled')
  })
})
