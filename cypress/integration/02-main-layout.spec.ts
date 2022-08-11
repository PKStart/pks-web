import { birthdaysPo } from '../support/page-objects/birthdays.po'
import { koreanPo } from '../support/page-objects/korean.po'
import { appBarPo } from '../support/page-objects/main-layout.po'
import { notesPo } from '../support/page-objects/notes.po'
import { personalDataPo } from '../support/page-objects/personalData.po'
import { shortcutsPo } from '../support/page-objects/shortcuts.po'
import { weatherPo } from '../support/page-objects/weather.po'

describe('Main page layout', () => {
  beforeEach(() => {
    cy.login()
  })

  it('Should have all the default elements', () => {
    appBarPo.appBar().should('be.visible')
    appBarPo.pLogo().should('be.visible')
    appBarPo.weatherBtn().should('be.visible')
    appBarPo.koreanBtn().should('be.visible')
    appBarPo.personalDataBtn().should('be.visible')
    appBarPo.birthdaysBtn().should('be.visible')
    appBarPo.moreBtn().should('be.visible')
    appBarPo.notesBtn().should('not.exist')
    // appBarPo.notificationsBtn().should('not.exist') // sometimes location permission throws error :(
    notesPo.box().should('be.visible')
    weatherPo.box().should('not.exist')
    personalDataPo.box().should('not.exist')
    koreanPo.box().should('not.exist')
    birthdaysPo.box().should('not.exist')
    shortcutsPo.menu().should('be.visible')
    shortcutsPo.menuButtons().should('have.length', 5)
  })

  it('Should be possible to switch widgets on and off', () => {
    notesPo.closeBtn().click()
    notesPo.box().should('not.exist')
    appBarPo.notesBtn().should('be.visible').click()
    notesPo.box().should('be.visible')
    appBarPo.notesBtn().should('not.exist')

    appBarPo.weatherBtn().click()
    weatherPo.box().should('be.visible')
    appBarPo.weatherBtn().should('not.exist')
    weatherPo.closeBtn().click()
    weatherPo.box().should('not.exist')
    appBarPo.weatherBtn().should('be.visible')

    appBarPo.koreanBtn().click()
    koreanPo.box().should('be.visible')
    appBarPo.koreanBtn().should('not.exist')
    koreanPo.closeBtn().click()
    koreanPo.box().should('not.exist')
    appBarPo.koreanBtn().should('be.visible')

    appBarPo.personalDataBtn().click()
    personalDataPo.box().should('be.visible')
    appBarPo.personalDataBtn().should('not.exist')
    personalDataPo.closeBtn().click()
    personalDataPo.box().should('not.exist')
    appBarPo.personalDataBtn().should('be.visible')

    appBarPo.birthdaysBtn().click()
    birthdaysPo.box().should('be.visible')
    appBarPo.birthdaysBtn().should('not.exist')
    birthdaysPo.closeBtn().click()
    birthdaysPo.box().should('not.exist')
    appBarPo.birthdaysBtn().should('be.visible')
  })

  it('Should have the "More" menu with proper contents', () => {
    appBarPo.moreBtn().click()
    appBarPo.moreMenu().should('be.visible')
    appBarPo.moreMenuButtons().should('have.length', 4)
    appBarPo.moreMenuBtn(0).should('contain', 'Light theme')
    appBarPo.moreMenuBtn(1).should('contain', 'Data backup')
    appBarPo.moreMenuBtn(2).should('contain', 'Settings')
    appBarPo.moreMenuBtn(3).should('contain', 'Log out')
  })
})
