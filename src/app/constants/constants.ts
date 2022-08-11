import { MatDialogConfig } from '@angular/material/dialog'

export const LIGHT_THEME_CLASS = 'pk-light-theme'

export enum StoreKeys {
  AUTH = 'pk-start-auth',
  SETTINGS = 'pk-start-settings',
  APP_BAR = 'pk-start-app-bar',
  BIRTHDAYS = 'pk-start-birthdays',
  KOREAN = 'pk-start-korean',
}

export const defaultDialogConfig: MatDialogConfig = {
  disableClose: true,
  width: '600px',
  maxWidth: '95%',
}
