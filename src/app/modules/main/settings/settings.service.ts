import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PkStartSettings, PkStartSettingsRequest } from '@kinpeter/pk-common'
import { Observable } from 'rxjs'
import { filter, switchMap } from 'rxjs/operators'
import { defaultDialogConfig } from '../../../constants/constants'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'
import { SettingsStore } from '../../shared/services/settings.store'
import { SettingsDialogComponent } from './settings-dialog.component'
import { parseError } from '../../../utils/parse-error'

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(
    private apiService: ApiService,
    private settingsStore: SettingsStore,
    private matDialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  public openDialog(): void {
    this.matDialog
      .open(SettingsDialogComponent, {
        ...defaultDialogConfig,
        data: {
          ...this.settingsStore.allState,
        },
      })
      .afterClosed()
      .pipe(
        filter(values => values),
        switchMap(values => this.saveSettings(values))
      )
      .subscribe({
        next: res => {
          this.settingsStore.setSettings(res)
          this.notificationService.showSuccess('Settings have been saved')
        },
        error: err => {
          this.notificationService.showError('Unable to save settings. ' + parseError(err))
        },
      })
  }

  private saveSettings(settings: PkStartSettingsRequest): Observable<PkStartSettings> {
    return this.apiService.put<PkStartSettingsRequest, PkStartSettings>(
      ApiRoutes.SETTINGS,
      settings
    )
  }
}
