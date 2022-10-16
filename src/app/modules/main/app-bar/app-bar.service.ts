import { Injectable } from '@angular/core'
import { StoreKeys } from '../../../constants/constants'
import { LocalStore } from '../../../utils/store'

export interface AppBarState {
  weatherOpen: boolean
  notesOpen: boolean
  birthdaysOpen: boolean
  koreanOpen: boolean
  personalDataOpen: boolean
  mouseOpen: boolean
  cyclingOpen: boolean
}

const initialState: AppBarState = {
  birthdaysOpen: false,
  koreanOpen: false,
  notesOpen: true,
  weatherOpen: false,
  personalDataOpen: false,
  mouseOpen: false,
  cyclingOpen: false,
}

@Injectable({ providedIn: 'root' })
export class AppBarService extends LocalStore<AppBarState> {
  constructor() {
    super(StoreKeys.APP_BAR, initialState)
  }

  public weatherOpen$ = this.select(state => state.weatherOpen)
  public notesOpen$ = this.select(state => state.notesOpen)
  public birthdaysOpen$ = this.select(state => state.birthdaysOpen)
  public personalDataOpen$ = this.select(state => state.personalDataOpen)
  public koreanOpen$ = this.select(state => state.koreanOpen)
  public mouseOpen$ = this.select(state => state.mouseOpen)
  public cyclingOpen$ = this.select(state => state.cyclingOpen)

  public toggleWeather(): void {
    this.setState({ weatherOpen: !this.state.weatherOpen })
  }

  public toggleNotes(): void {
    this.setState({ notesOpen: !this.state.notesOpen })
  }

  public toggleBirthdays(): void {
    this.setState({ birthdaysOpen: !this.state.birthdaysOpen })
  }

  public togglePersonalData(): void {
    this.setState({ personalDataOpen: !this.state.personalDataOpen })
  }

  public toggleKorean(): void {
    this.setState({ koreanOpen: !this.state.koreanOpen })
  }

  public toggleMouse(): void {
    this.setState({ mouseOpen: !this.state.mouseOpen })
  }

  public toggleCycling(): void {
    this.setState({ cyclingOpen: !this.state.cyclingOpen })
  }

  public resetState(): void {
    this.setState({ ...initialState })
  }
}
