import { NgModule } from '@angular/core'
import { KoreanComponent } from './korean.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [KoreanComponent],
  imports: [SharedModule],
  exports: [KoreanComponent],
})
export class KoreanModule {}
