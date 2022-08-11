import { Injectable } from '@angular/core'
import { UserSettings } from 'pks-common'
import { Observable } from 'rxjs'
import { StoreKeys } from '../../../constants/constants'
import { LocalStore } from '../../../utils/store'

const initialState: UserSettings = {
  shortcutIconBaseUrl: null,
  weatherApiKey: null,
  locationApiKey: null,
  birthdaysUrl: null,
  koreanUrl: null,
}

@Injectable({ providedIn: 'root' })
export class SettingsStore extends LocalStore<UserSettings> {
  constructor() {
    super(StoreKeys.SETTINGS, { ...initialState })
  }

  public get apiKeys(): Observable<Partial<UserSettings>> {
    return this.select(state => {
      return {
        weatherApiKey: state.weatherApiKey,
        locationApiKey: state.locationApiKey,
      }
    })
  }

  public get shortcutIconBaseUrl(): string | null {
    return this.state.shortcutIconBaseUrl
  }

  public get birthdaysUrl(): string | null {
    return this.state.birthdaysUrl
  }

  public get koreanUrl(): string | null {
    return this.state.koreanUrl
  }

  public get allState(): UserSettings {
    return { ...this.state }
  }

  public setSettings(settings: UserSettings): void {
    this.setState(settings)
  }

  public clearSettings(): void {
    this.setState({ ...initialState })
  }
}
