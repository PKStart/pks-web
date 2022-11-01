import { Component, Input } from '@angular/core'

@Component({
  selector: 'pk-cycling-goals',
  template: `
    <mat-card>
      <mat-card-content>
        <p>
          Weekly goal: <b>{{ weekTotal }} / {{ weeklyGoal }}</b> km
        </p>
        <div class="progress-bar-line">
          <mat-progress-bar
            [color]="weekTotal >= weeklyGoal ? 'primary' : 'accent'"
            [value]="weekTotal / (weeklyGoal / 100)"
          ></mat-progress-bar>
          <mat-icon *ngIf="weekTotal >= weeklyGoal" color="primary">check</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>
    <mat-card>
      <mat-card-content>
        <p>
          Monthly goal: <b>{{ monthTotal }} / {{ monthlyGoal }}</b> km
        </p>
        <mat-progress-bar
          [color]="monthTotal >= monthlyGoal ? 'primary' : 'accent'"
          [value]="monthTotal / (monthlyGoal / 100)"
        ></mat-progress-bar>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        margin-bottom: 0.5rem;
      }

      .progress-bar-line {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    `,
  ],
})
export class GoalsComponent {
  @Input() weeklyGoal!: number
  @Input() weekTotal!: number
  @Input() monthlyGoal!: number
  @Input() monthTotal!: number
}
