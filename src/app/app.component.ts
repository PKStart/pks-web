import { Component } from '@angular/core'
import { AuthService } from './modules/auth/auth.service'
import { ApiWakeupService } from './modules/shared/services/api-wakeup.service'
import { NotificationService } from './modules/shared/services/notification.service'

@Component({
  selector: 'pk-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  private isApiAwake = false

  constructor(
    private authService: AuthService,
    private apiWakeupService: ApiWakeupService,
    private notificationService: NotificationService
  ) {
    this.sendWakeupCall()
    // Testing Fly.io server, if the backend doesn't sleep, don't need this call
    // TODO Remove code if obsolete thanks to new server
    // Send wakeup calls to the API because Heroku free dyno goes to sleep after 30 minutes of inactivity
    // setInterval(() => this.sendWakeupCall(), 1000 * 60 * 29)
    authService.autoLogin()
  }

  private sendWakeupCall(): void {
    this.apiWakeupService.wakeUp().subscribe({
      next: res => {
        !this.isApiAwake && console.log(res.result)
        this.isApiAwake = true
      },
      error: err =>
        this.notificationService.showError('API wakeup call failed. ' + err.error.message),
    })
  }
}
