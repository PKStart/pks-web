import { Component, EventEmitter, Output } from '@angular/core'
import { CyclingService } from './cycling.service'

@Component({
  selector: 'pk-cycling-menu',
  template: `
    <button mat-icon-button matTooltip="Menu" [matMenuTriggerFor]="menu">
      <mat-icon>more_horiz</mat-icon>
    </button>
    <mat-menu #menu="matMenu" class="app-bar__more-menu">
      <div mat-menu-item>
        <mat-checkbox [checked]="(goalsOpen$ | async) ?? true" (change)="toggleWidget('goals')">
          Show goals
        </mat-checkbox>
      </div>
      <div mat-menu-item>
        <mat-checkbox [checked]="(statsOpen$ | async) ?? true" (change)="toggleWidget('stats')">
          Show stats
        </mat-checkbox>
      </div>
      <div mat-menu-item>
        <mat-checkbox [checked]="(choresOpen$ | async) ?? true" (change)="toggleWidget('chores')">
          Show chores
        </mat-checkbox>
      </div>

      <mat-divider></mat-divider>

      <button mat-menu-item (click)="setWeeklyGoal.emit()">
        <mat-icon>flag</mat-icon>
        <span>Set weekly goal</span>
      </button>
      <button mat-menu-item (click)="setMonthlyGoal.emit()">
        <mat-icon>flag</mat-icon>
        <span>Set monthly goal</span>
      </button>
      <button mat-menu-item (click)="addChore.emit()">
        <mat-icon>add</mat-icon>
        <span>Add new chore</span>
      </button>
    </mat-menu>
  `,
  styles: [``],
})
export class CyclingMenuComponent {
  public statsOpen$ = this.cyclingService.statsOpen$
  public goalsOpen$ = this.cyclingService.goalsOpen$
  public choresOpen$ = this.cyclingService.choresOpen$
  public toggleWidget = this.cyclingService.toggleWidget.bind(this.cyclingService)

  @Output() setWeeklyGoal = new EventEmitter<void>()
  @Output() setMonthlyGoal = new EventEmitter<void>()
  @Output() addChore = new EventEmitter<void>()

  constructor(private cyclingService: CyclingService) {}
}
