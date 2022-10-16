import { NgModule } from '@angular/core'
import { BirthdaysComponent } from './birthdays.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [BirthdaysComponent],
  imports: [SharedModule],
  exports: [BirthdaysComponent],
})
export class BirthdaysModule {}
