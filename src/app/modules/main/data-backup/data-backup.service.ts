import { Injectable } from '@angular/core'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'
import { parseError } from '../../../utils/parse-error'

@Injectable({ providedIn: 'root' })
export class DataBackupService {
  constructor(private apiService: ApiService, private notificationService: NotificationService) {}

  public sendBackupRequest(): void {
    this.notificationService.showSuccess('Request for data backup has been sent.')
    this.apiService.get(ApiRoutes.DATA_BACKUP).subscribe({
      next: () => {
        this.notificationService.showSuccess('Data backup email has been dispatched successfully!')
      },
      error: err => {
        this.notificationService.showError('Data backup failed. ' + parseError(err))
      },
    })
  }
}
