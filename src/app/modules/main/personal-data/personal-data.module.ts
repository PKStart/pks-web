import { NgModule } from '@angular/core'
import { PersonalDataCardComponent } from './personal-data-card.component'
import { PersonalDataComponent } from './personal-data.component'
import { PersonalDataDialogComponent } from './personal-data-dialog.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [PersonalDataCardComponent, PersonalDataComponent, PersonalDataDialogComponent],
  imports: [SharedModule],
  exports: [PersonalDataComponent],
})
export class PersonalDataModule {}
