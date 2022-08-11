import { Component } from '@angular/core'
import { AppBarService } from './app-bar/app-bar.service'

@Component({
  selector: 'pk-main',
  template: `
    <pk-app-bar></pk-app-bar>
    <div class="main-content">
      <div class="main-left">
        <pk-notes *ngIf="appBarService.notesOpen$ | async"></pk-notes>
      </div>
      <div class="main-center">
        <pk-personal-data *ngIf="appBarService.personalDataOpen$ | async"></pk-personal-data>
        <pk-korean *ngIf="appBarService.koreanOpen$ | async"></pk-korean>
        <pk-birthdays *ngIf="appBarService.birthdaysOpen$ | async"></pk-birthdays>
      </div>
      <div class="main-right">
        <pk-weather *ngIf="appBarService.weatherOpen$ | async"></pk-weather>
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
        gap: 1rem;
        overflow-y: auto;
        padding: 1rem;

        @media (min-width: 1200px) {
          height: calc(100% - 64px);
        }

        > div {
          width: auto;
          height: auto;
          max-height: 100%;
        }

        .main-center {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-end;
          gap: 1rem;
          max-height: calc(100% - 58px);
          overflow-y: auto;
        }
      }
    `,
  ],
})
export class MainComponent {
  constructor(public appBarService: AppBarService) {}
}
