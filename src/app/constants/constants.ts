import { MatDialogConfig } from '@angular/material/dialog'

export const LIGHT_THEME_CLASS = 'pk-light-theme'

export enum StoreKeys {
  AUTH = 'pk-start-auth',
  SETTINGS = 'pk-start-settings',
  APP_BAR = 'pk-start-app-bar',
  BIRTHDAYS = 'pk-start-birthdays',
  KOREAN = 'pk-start-korean',
  LOCATION = 'pk-start-location',
  CYCLING = 'pk-start-cycling',
  STRAVA_AUTH = 'pk-start-strava-auth',
}

export const defaultDialogConfig: MatDialogConfig = {
  disableClose: true,
  width: '600px',
  maxWidth: '95%',
}
