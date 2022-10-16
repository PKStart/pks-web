import { Component, Input } from '@angular/core'
import { StravaRideStats } from './cycling.types'

@Component({
  selector: 'pk-stats-table',
  template: `
    <mat-card class="stats-table">
      <mat-card-content>
        <header>
          <p>
            <b>{{ title }}</b>
          </p>
        </header>
        <main>
          <p>
            <mat-icon color="accent" class="material-icons-outlined">numbers</mat-icon>
            <span>
              <b>{{ data.activityCount }}</b> {{ data.activityCount === 1 ? 'ride' : 'rides' }}
            </span>
          </p>
          <p>
            <mat-icon color="accent" class="material-icons-outlined">directions_bike</mat-icon>
            <span>
              <b>{{ data.distance }}</b> km
            </span>
          </p>
          <p>
            <mat-icon color="accent" class="material-icons-outlined">landscape</mat-icon>
            <span>
              <b>{{ data.elevationGain }}</b> m
            </span>
          </p>
          <p>
            <mat-icon color="accent" class="material-icons-outlined">timer</mat-icon>
            <span>
              <b>{{ data.movingTime }}</b> {{ data.movingTime === 1 ? 'hr' : 'hrs' }}
            </span>
          </p>
        </main>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .stats-table {
        width: 100%;

        p {
          margin: 0 0 0.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        header {
          margin-bottom: 0.5rem;
        }
        main {
          padding: 0 1rem;

          p {
            margin: 0;
          }
        }
      }
    `,
  ],
})
export class StatsTableComponent {
  @Input() title!: string
  @Input() data!: StravaRideStats
}
