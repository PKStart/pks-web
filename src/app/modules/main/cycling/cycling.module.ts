import { NgModule } from '@angular/core'
import { CyclingComponent } from './cycling.component'
import { RideStatsComponent } from './ride-stats.component'
import { SharedModule } from '../../shared/shared.module'
import { StatsTableComponent } from './stats-table.component'
import { BikeCardComponent } from './bike-card.component'

@NgModule({
  declarations: [CyclingComponent, BikeCardComponent, RideStatsComponent, StatsTableComponent],
  imports: [SharedModule],
  exports: [CyclingComponent],
})
export class CyclingModule {}
