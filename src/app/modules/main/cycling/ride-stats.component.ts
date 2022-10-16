import { Component, Input } from '@angular/core'
import { StravaAthleteData } from './cycling.types'

@Component({
  selector: 'pk-ride-stats',
  template: `
    <div class="ride-stats">
      <pk-stats-table title="This week" [data]="data.thisWeek"></pk-stats-table>
      <pk-stats-table title="This Month" [data]="data.thisMonth"></pk-stats-table>
      <pk-stats-table title="This year" [data]="data.ytdRideTotals"></pk-stats-table>
      <pk-stats-table title="All times" [data]="data.allRideTotals"></pk-stats-table>
    </div>
  `,
  styles: [
    `
      .ride-stats {
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        grid-gap: 0.5rem;
      }
    `,
  ],
})
export class RideStatsComponent {
  @Input() data!: StravaAthleteData
}
