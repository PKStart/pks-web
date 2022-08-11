import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'

import { AuthComponent } from './auth.component'

@NgModule({
  imports: [SharedModule],
  exports: [],
  declarations: [AuthComponent],
  providers: [],
})
export class AuthModule {}
