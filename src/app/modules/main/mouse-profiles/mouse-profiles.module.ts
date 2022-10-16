import { NgModule } from '@angular/core'
import { MouseProfilesComponent } from './mouse-profiles.component'
import { ProfileChipComponent } from './profile-chip.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [MouseProfilesComponent, ProfileChipComponent],
  imports: [SharedModule],
  exports: [MouseProfilesComponent],
})
export class MouseProfilesModule {}
