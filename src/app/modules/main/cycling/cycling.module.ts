import { NgModule } from '@angular/core'
import { CyclingComponent } from './cycling.component'
import { RideStatsComponent } from './widgets/ride-stats.component'
import { SharedModule } from '../../shared/shared.module'
import { StatsTableComponent } from './widgets/stats-table.component'
import { BikeCardComponent } from './bike-card.component'
import { ChoresComponent } from './widgets/chores.component'
import { GoalsComponent } from './widgets/goals.component'
import { CyclingMenuComponent } from './cycling-menu.component'
import { WeeklyGoalDialogComponent } from './dialogs/weekly-goal-dialog.component'
import { MonthlyGoalDialogComponent } from './dialogs/monthly-goal-dialog.component'
import { ChoreDialogComponent } from './dialogs/chore-dialog.component'

@NgModule({
  declarations: [
    CyclingComponent,
    CyclingMenuComponent,
    BikeCardComponent,
    RideStatsComponent,
    StatsTableComponent,
    ChoresComponent,
    GoalsComponent,
    WeeklyGoalDialogComponent,
    MonthlyGoalDialogComponent,
    ChoreDialogComponent,
  ],
  imports: [SharedModule],
  exports: [CyclingComponent],
})
export class CyclingModule {}
