import { Component, Input } from '@angular/core'
import { StravaAthleteData } from '../cycling.types'

@Component({
  selector: 'pk-ride-stats',
  template: `
    <div class="ride-stats">
      <mat-card class="bike">
        <mat-card-content>
          <mat-icon color="accent">directions_bike</mat-icon>
          <span>
            <b>{{ data.primaryBike.name }}</b>
          </span>
          <span>({{ data.primaryBike.distance }} km)</span>
        </mat-card-content>
      </mat-card>
      <div class="grid">
        <pk-stats-table title="This week" [data]="data.thisWeek"></pk-stats-table>
        <pk-stats-table title="This Month" [data]="data.thisMonth"></pk-stats-table>
        <pk-stats-table title="This year" [data]="data.ytdRideTotals"></pk-stats-table>
        <pk-stats-table title="All times" [data]="data.allRideTotals"></pk-stats-table>
      </div>
      <mat-card class="longest">
        <mat-card-content>
          Longest ride: <b>{{ data.longestRideEver }}</b> km
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .ride-stats {
        margin-bottom: 0.5rem;

        .grid {
          display: grid;
          grid-template-rows: 1fr 1fr;
          grid-template-columns: 1fr 1fr;
          grid-gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .longest b {
          color: var(--color-accent);
        }

        .bike {
          margin-bottom: 0.5rem;

          mat-card-content {
            display: flex;
            align-items: center;

            mat-icon,
            span {
              margin-right: 0.5rem;
            }
          }
        }
      }
    `,
  ],
})
export class RideStatsComponent {
  @Input() data!: StravaAthleteData
}
