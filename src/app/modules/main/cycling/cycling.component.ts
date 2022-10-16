import { Component, OnDestroy, OnInit } from '@angular/core'
import { AppBarService } from '../app-bar/app-bar.service'
import { CyclingService } from './cycling.service'
import { ActivatedRoute, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { Subscription } from 'rxjs'
import { StravaAthleteData } from './cycling.types'

@Component({
  selector: 'pk-cycling',
  template: `
    <div class="main-box">
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
              <a mat-raised-button color="accent" [href]="stravaOauthUrl">Log in to Strava</a>
            </mat-card-content>
          </mat-card>
          <ng-container *ngIf="(needAuth$ | async) === false">
            <pk-ride-stats [data]="stravaData"></pk-ride-stats>
          </ng-container>
          <!--          <mat-expansion-panel>-->
          <!--            <mat-expansion-panel-header>-->
          <!--              <mat-panel-title>-->
          <!--                <b>Change game profile</b>-->
          <!--              </mat-panel-title>-->
          <!--            </mat-expansion-panel-header>-->
          <!--            <p>expansion panel...</p>-->
          <!--          </mat-expansion-panel>-->
        </ng-container>
      </main>
    </div>
  `,
  styles: [
    `
      mat-card:not(:last-of-type) {
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class CyclingComponent implements OnInit, OnDestroy {
  public loading$ = this.cyclingService.loading$
  public disabled$ = this.cyclingService.disabled$
  public needAuth$ = this.cyclingService.needAuth$
  public stravaOauthUrl = this.cyclingService.stravaOauthUrl
  public stravaData!: StravaAthleteData

  private subscription = new Subscription()

  constructor(
    public appBarService: AppBarService,
    private cyclingService: CyclingService,
    private route: ActivatedRoute,
    private router: Router
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
    this.subscription.add(
      this.cyclingService.stravaAthleteData$.pipe(filter(Boolean)).subscribe(data => {
        this.stravaData = data
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  public refetch(): void {
    this.cyclingService.fetchStravaData()
  }
}
