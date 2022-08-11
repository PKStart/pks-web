import { Component } from '@angular/core'
import { AppBarService } from '../app-bar/app-bar.service'
import { BirthdaysService } from './birthdays.service'

@Component({
  selector: 'pk-birthdays',
  template: `
    <div class="main-box">
      <header class="main-box-header">
        <h1 class="main-box-title">Birthdays</h1>
        <div class="main-box-actions">
          <button
            mat-icon-button
            matTooltip="Sync birthdays"
            matTooltipPosition="left"
            (click)="refetch()"
            [disabled]="(loading$ | async) || (disabled$ | async)"
          >
            <mat-icon>sync</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Close" (click)="appBarService.toggleBirthdays()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </header>
      <main class="main-box-content">
        <div *ngIf="loading$ | async" class="main-box-loading">
          <mat-spinner diameter="32" color="accent"></mat-spinner>
        </div>
        <div *ngIf="disabled$ | async" class="main-box-message">Birthdays are not available.</div>
        <ng-container *ngIf="(loading$ | async) === false && (disabled$ | async) === false">
          <mat-card>
            <mat-card-content *ngIf="!(today$ | async)?.length">
              No birthdays today.
            </mat-card-content>
            <mat-card-content *ngIf="((today$ | async)?.length || 0) > 0">
              <h1>Birthdays today:</h1>
              <p *ngFor="let item of today$ | async" class="birthday-line">{{ item.name }}</p>
            </mat-card-content>
          </mat-card>
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <b> Upcoming birthdays ({{ (upcoming$ | async)?.length || 0 }}) </b>
              </mat-panel-title>
            </mat-expansion-panel-header>
            <p *ngFor="let item of upcoming$ | async" class="birthday-line">
              {{ item.name }} <span>({{ item.date }})</span>
            </p>
          </mat-expansion-panel>
        </ng-container>
      </main>
    </div>
  `,
  styles: [
    // language=scss
    `
      mat-card {
        margin-bottom: 0.5rem;

        h1 {
          font-size: 1rem;
        }
      }

      mat-expansion-panel-header {
        padding: 0 1rem;
      }

      .birthday-line {
        margin: 0 0 0.25rem;
        padding-left: 1rem;

        span {
          margin-left: 0.5rem;
          opacity: 0.75;
        }
      }
    `,
  ],
})
export class BirthdaysComponent {
  public loading$ = this.birthdaysService.loading$
  public disabled$ = this.birthdaysService.disabled$
  public today$ = this.birthdaysService.today$
  public upcoming$ = this.birthdaysService.upcoming$

  constructor(private birthdaysService: BirthdaysService, public appBarService: AppBarService) {}

  public refetch(): void {
    this.birthdaysService.fetchBirthdays()
  }
}
