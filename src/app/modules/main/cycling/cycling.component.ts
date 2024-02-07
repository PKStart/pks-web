import { Component, OnDestroy, OnInit } from '@angular/core'
import { AppBarService } from '../app-bar/app-bar.service'
import { CyclingService } from './cycling.service'
import { ActivatedRoute, Router } from '@angular/router'
import { filter, map, tap } from 'rxjs/operators'
import { combineLatest, Subscription, take } from 'rxjs'
import { StravaAthleteData } from './cycling.types'
import { Cycling, UUID } from '@kinpeter/pk-common'
import { MatDialog } from '@angular/material/dialog'
import { WeeklyGoalDialogComponent } from './dialogs/weekly-goal-dialog.component'
import { defaultDialogConfig } from '../../../constants/constants'
import { MonthlyGoalDialogComponent } from './dialogs/monthly-goal-dialog.component'
import { ChoreDialogComponent } from './dialogs/chore-dialog.component'
import { ConfirmationService } from '../../shared/services/confirmation.service'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'pk-cycling',
  template: `
    <div
      class="main-box"
      [class.max-size]="
        (allWidgetsOpen$ | async) &&
        cyclingData &&
        cyclingData.chores &&
        cyclingData.chores.length > 1
      "
    >
      <header class="main-box-header">
        <h1 class="main-box-title">Cycling</h1>
        <div class="main-box-actions">
          <button
            mat-icon-button
            matTooltip="Sync Strava"
            matTooltipPosition="left"
            (click)="refetch()"
            [disabled]="(loading$ | async) || (disabled$ | async) || (needAuth$ | async)"
          >
            <mat-icon>sync</mat-icon>
          </button>
          <pk-cycling-menu
            (setWeeklyGoal)="onSetWeeklyGoal()"
            (setMonthlyGoal)="onSetMonthlyGoal()"
            (addChore)="onAddChore()"
          ></pk-cycling-menu>
          <button mat-icon-button matTooltip="Close" (click)="appBarService.toggleCycling()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </header>
      <main class="main-box-content">
        <div *ngIf="loading$ | async" class="main-box-loading">
          <mat-spinner diameter="32" color="accent"></mat-spinner>
        </div>
        <div *ngIf="disabled$ | async" class="main-box-message">
          Strava service is not available.
        </div>
        <ng-container *ngIf="(loading$ | async) === false && (disabled$ | async) === false">
          <mat-card *ngIf="needAuth$ | async">
            <mat-card-content>
              <a
                *ngIf="!stravaLogosEnabled"
                mat-raised-button
                color="accent"
                [href]="stravaOauthUrl"
                >Log in to Strava</a
              >
              <a *ngIf="stravaLogosEnabled" [href]="stravaOauthUrl">
                <img
                  src="/assets/strava/btn_strava_connectwith_orange.png"
                  alt="Connect With Strava"
                />
              </a>
            </mat-card-content>
          </mat-card>
          <ng-container *ngIf="(needAuth$ | async) === false">
            <pk-cycling-goals
              *ngIf="goalsOpen$ | async"
              [weeklyGoal]="cyclingData.weeklyGoal!"
              [weekTotal]="stravaData.thisWeek.distance!"
              [monthlyGoal]="cyclingData.monthlyGoal!"
              [monthTotal]="stravaData.thisMonth.distance!"
            ></pk-cycling-goals>
            <pk-ride-stats *ngIf="statsOpen$ | async" [data]="stravaData"></pk-ride-stats>
            <pk-cycling-chores
              *ngIf="choresOpen$ | async"
              [bikeData]="stravaData.primaryBike"
              [chores]="cyclingData.chores ?? []"
              (edit)="onEditChore($event)"
              (delete)="onDeleteChore($event)"
            ></pk-cycling-chores>
            <div
              *ngIf="
                (goalsOpen$ | async) === false &&
                (statsOpen$ | async) === false &&
                (choresOpen$ | async) === false
              "
              class="no-widget"
            >
              Open a widget from the menu!
            </div>
          </ng-container>
        </ng-container>
        <div *ngIf="stravaLogosEnabled" class="powered-by-strava">
          <img
            src="/assets/strava/api_logo_pwrdBy_strava_horiz_white.png"
            alt="Powered by Strava"
          />
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .main-box {
        max-height: 900px;

        &.max-size {
          height: calc(100vh - 64px - 6rem);
        }
      }

      mat-card:not(:last-of-type) {
        margin-bottom: 0.5rem;
      }

      .no-widget {
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .powered-by-strava {
        display: flex;
        justify-content: center;
        padding-top: 8px;
      }
    `,
  ],
})
export class CyclingComponent implements OnInit, OnDestroy {
  public loading$ = this.cyclingService.loading$
  public disabled$ = this.cyclingService.disabled$
  public needAuth$ = this.cyclingService.needAuth$
  public statsOpen$ = this.cyclingService.statsOpen$
  public goalsOpen$ = this.cyclingService.goalsOpen$
  public choresOpen$ = this.cyclingService.choresOpen$
  public allWidgetsOpen$ = combineLatest([
    this.cyclingService.goalsOpen$,
    this.cyclingService.statsOpen$,
    this.cyclingService.choresOpen$,
  ]).pipe(map(([goals, stats, chores]) => goals && stats && chores))
  public stravaOauthUrl = this.cyclingService.stravaOauthUrl
  public stravaData!: StravaAthleteData
  public cyclingData!: Cycling
  public stravaLogosEnabled = environment.PK_STRAVA_LOGOS === 'enabled'

  private subscription = new Subscription()

  constructor(
    public appBarService: AppBarService,
    private cyclingService: CyclingService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private confirmationService: ConfirmationService
  ) {
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        if (params?.code) {
          this.cyclingService.exchangeOauthCodeToToken(params.code)
          this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} }).then()
        }
      })
    )
  }

  ngOnInit() {
    this.cyclingService.fetchStravaData()
    this.cyclingService.fetchCyclingData()
    this.subscription.add(
      combineLatest([this.cyclingService.stravaAthleteData$, this.cyclingService.cyclingData$])
        .pipe(
          filter(([stravaData, cyclingData]) => !!stravaData && !!cyclingData),
          tap({
            next: ([stravaData, cyclingData]) => {
              this.stravaData = stravaData!
              this.cyclingData = cyclingData!
            },
          })
        )
        .subscribe()
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  public refetch(): void {
    this.cyclingService.fetchStravaData()
  }

  public onSetWeeklyGoal(): void {
    this.matDialog
      .open(WeeklyGoalDialogComponent, { ...defaultDialogConfig, width: '400px' })
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(({ weeklyGoal }) => this.cyclingService.setWeeklyGoal(weeklyGoal)),
        take(1)
      )
      .subscribe()
  }

  public onSetMonthlyGoal(): void {
    this.matDialog
      .open(MonthlyGoalDialogComponent, { ...defaultDialogConfig, width: '400px' })
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(({ monthlyGoal }) => this.cyclingService.setMonthlyGoal(monthlyGoal)),
        take(1)
      )
      .subscribe()
  }

  public onAddChore(): void {
    this.matDialog
      .open(ChoreDialogComponent, { ...defaultDialogConfig, width: '400px' })
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(chore => this.cyclingService.addNewChore(chore)),
        take(1)
      )
      .subscribe()
  }

  public onEditChore(id: UUID): void {
    const chore = this.cyclingData.chores?.find(c => c.id === id)
    if (!chore) return
    this.matDialog
      .open(ChoreDialogComponent, { ...defaultDialogConfig, width: '400px', data: chore })
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(chore => this.cyclingService.editChore(id, chore)),
        take(1)
      )
      .subscribe()
  }

  public onDeleteChore(id: UUID): void {
    const chore = this.cyclingData.chores?.find(c => c.id === id)
    if (!chore) return
    this.confirmationService
      .question(`Do you really want to delete the chore: ${chore.name}?`)
      .pipe(
        filter(isConfirmed => isConfirmed),
        tap(() => this.cyclingService.deleteChore(id)),
        take(1)
      )
      .subscribe()
  }
}
