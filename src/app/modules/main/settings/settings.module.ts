import { NgModule } from '@angular/core'
import { SettingsDialogComponent } from './settings-dialog.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [SettingsDialogComponent],
  imports: [SharedModule],
  exports: [SettingsDialogComponent],
})
export class SettingsModule {}
