import { Component } from '@angular/core'
import { AppBarService } from './app-bar/app-bar.service'
import { RandomBackgroundService } from '../shared/services/random-background.service'

@Component({
  selector: 'pk-main',
  template: `
    <pk-app-bar></pk-app-bar>
    <div class="main-content" [style.background-image]="imageUrl$ | async">
      <div class="main-left">
        <div class="column col-1">
          <pk-notes *ngIf="appBarService.notesOpen$ | async"></pk-notes>
        </div>
      </div>
      <div class="main-middle">
        <div class="column col-2">
          <pk-mouse-profiles *ngIf="appBarService.mouseOpen$ | async"></pk-mouse-profiles>
          <pk-cycling *ngIf="appBarService.cyclingOpen$ | async"></pk-cycling>
        </div>
        <div class="column col-3">
          <pk-personal-data *ngIf="appBarService.personalDataOpen$ | async"></pk-personal-data>
          <pk-korean *ngIf="appBarService.koreanOpen$ | async"></pk-korean>
          <pk-birthdays *ngIf="appBarService.birthdaysOpen$ | async"></pk-birthdays>
        </div>
      </div>
      <div class="main-right">
        <div class="column col-4">
          <pk-weather *ngIf="appBarService.weatherOpen$ | async"></pk-weather>
        </div>
      </div>
    </div>
    <pk-shortcuts></pk-shortcuts>
  `,
  styles: [
    //language=scss
    `
      .main-content {
        width: 100%;
        height: calc(100% - 64px - 58px);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1rem;
        overflow-y: auto;
        padding: 1rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        .main-left,
        .main-right {
          width: auto;
          max-height: 100vh;
          display: block;
        }

        @media (min-width: 1200px) {
          height: calc(100% - 64px);
        }

        @media (min-width: 1770px) {
          .main-right,
          .main-left {
            max-height: 100%;
            display: flex;
            gap: 1rem;
          }
          .main-middle {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            gap: 1rem;
          }
        }
      }
    `,
  ],
})
export class MainComponent {
  public imageUrl$ = this.randomBackgroundService.imageUrl$

  constructor(
    public appBarService: AppBarService,
    private randomBackgroundService: RandomBackgroundService
  ) {}
}
