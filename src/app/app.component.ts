import { Component } from '@angular/core'
import { AuthService } from './modules/auth/auth.service'

@Component({
  selector: 'pk-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(private authService: AuthService) {
    this.authService.autoLogin()
  }
}
