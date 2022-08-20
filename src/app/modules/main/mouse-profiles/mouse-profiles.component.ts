import { Component, OnDestroy } from '@angular/core'
import { GameProfile } from 'pks-common'
import { combineLatest, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { AppBarService } from '../app-bar/app-bar.service'
import { MouseProfilesService } from './mouse-profiles.service'

@Component({
  selector: 'pk-mouse-profiles',
  template: ` <div class="main-box">
    <header class="main-box-header">
      <h1 class="main-box-title">Mouse Profiles</h1>
      <div class="main-box-actions">
        <button
          mat-icon-button
          matTooltip="Sync profiles"
          matTooltipPosition="left"
          (click)="refetch()"
          [disabled]="(loading$ | async) || (disabled$ | async)"
        >
          <mat-icon>sync</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Close" (click)="appBarService.toggleMouse()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </header>
    <main class="main-box-content">
      <div *ngIf="loading$ | async" class="main-box-loading">
        <mat-spinner diameter="32" color="accent"></mat-spinner>
      </div>
      <div *ngIf="disabled$ | async" class="main-box-message">
        Mouse profiles service is not available.
      </div>
      <ng-container *ngIf="(loading$ | async) === false && (disabled$ | async) === false">
        <mat-card>
          <mat-card-content>
            <p>
              <span>Current profile:</span>
              <pk-profile-chip
                [default]="isDefault"
                [name]="currentProfile"
                [static]="true"
              ></pk-profile-chip>
            </p>
            <p *ngIf="isDefault">
              <span>Game configured:</span>
              <pk-profile-chip
                [default]="false"
                [name]="gameProfile.name"
                (clicked)="handleClick(1)"
              ></pk-profile-chip>
            </p>
            <p *ngIf="!isDefault">
              <span>Change to:</span>
              <pk-profile-chip
                [default]="true"
                name="Default"
                (clicked)="handleClick(0)"
              ></pk-profile-chip>
            </p>
          </mat-card-content>
        </mat-card>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>
              <b>Change game profile</b>
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p *ngFor="let profile of profiles" class="profile-line">
            <pk-profile-chip
              [default]="profile.isDefault ?? false"
              [name]="profile.name"
              [abbreviation]="profile.abbreviation"
              (clicked)="handleClick($event)"
            ></pk-profile-chip>
          </p>
        </mat-expansion-panel>
      </ng-container>
    </main>
  </div>`,
  styles: [
    `
      mat-card {
        margin-bottom: 0.5rem;
      }

      mat-card-content {
        p {
          display: flex;
          align-items: center;

          span {
            margin-right: 0.25rem;
          }
        }
      }

      mat-expansion-panel-header {
        padding: 0 1rem;
      }

      .profile-line {
        margin: 0 0 0.5rem;
      }
    `,
  ],
})
export class MouseProfilesComponent implements OnDestroy {
  public profiles: GameProfile[] = []
  public loading$ = this.mouseProfilesService.loading$
  public disabled$ = this.mouseProfilesService.disabled$
  public isDefault = false
  public currentProfile = ''
  public gameProfile!: GameProfile

  private subscription = new Subscription()

  constructor(
    public appBarService: AppBarService,
    private mouseProfilesService: MouseProfilesService
  ) {
    this.subscription.add(
      combineLatest([
        mouseProfilesService.profiles$,
        mouseProfilesService.activeProfile$,
        mouseProfilesService.configuredGame$,
      ])
        .pipe(filter(values => values.every(value => value !== null)))
        .subscribe({ next: values => this.handleMprData(...values) })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  public refetch(): void {
    this.mouseProfilesService.fetchProfiles()
  }

  public handleClick(profile: number | string): void {
    let payload =
      typeof profile === 'number'
        ? { profileNumber: profile, abbreviation: null }
        : { profileNumber: null, abbreviation: profile }
    this.mouseProfilesService.changeProfile(payload)
  }

  private handleMprData(
    profiles: GameProfile[],
    activeProfile: number | null,
    configuredGame: GameProfile | null
  ): void {
    if (activeProfile === null || configuredGame === null) return

    this.profiles = profiles.filter(
      profile => !profile.isDefault && profile.abbreviation !== configuredGame.abbreviation
    )

    if (activeProfile === 0) {
      this.isDefault = true
      this.currentProfile = 'Default'
      this.gameProfile = configuredGame
    } else {
      this.isDefault = false
      this.currentProfile = configuredGame.name
    }
  }
}
