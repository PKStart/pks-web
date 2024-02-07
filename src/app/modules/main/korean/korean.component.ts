import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core'
import { fromEvent, Subscription } from 'rxjs'
import { debounceTime, delay, distinctUntilChanged, filter, switchMap } from 'rxjs/operators'
import { AppBarService } from '../app-bar/app-bar.service'
import { KoreanService } from './korean.service'
import { DictionaryResult } from './korean.types'

@Component({
  selector: 'pk-korean',
  template: `
    <div class="main-box">
      <header class="main-box-header">
        <h1 class="main-box-title">Korean</h1>
        <div class="main-box-actions">
          <button
            mat-icon-button
            matTooltip="Sync word list"
            matTooltipPosition="left"
            (click)="refetch()"
            [disabled]="(loading$ | async) || ((disabled$ | async) ?? false)"
          >
            <mat-icon>sync</mat-icon>
          </button>
          <button mat-icon-button matTooltip="Close" (click)="appBarService.toggleKorean()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </header>
      <main class="main-box-content">
        <div *ngIf="loading$ | async" class="main-box-loading">
          <mat-spinner diameter="32" color="accent"></mat-spinner>
        </div>
        <div *ngIf="disabled$ | async" class="main-box-message">
          Korean word list is not available.
        </div>
        <ng-container *ngIf="(loading$ | async) === false && (disabled$ | async) === false">
          <mat-form-field appearance="fill">
            <mat-label>Search</mat-label>
            <input #searchInput matInput type="text" />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <ng-container *ngIf="results.length">
            <mat-card class="result-card" *ngFor="let result of results">
              <mat-card-content>
                <p>{{ result.word }}</p>
                <p>{{ result.translate }}</p>
              </mat-card-content>
            </mat-card>
          </ng-container>
          <mat-card *ngIf="!results.length" class="random-word-card">
            <header>
              <p><b>Random word</b></p>
              <button mat-icon-button (click)="getNewRandom()">
                <mat-icon>sync</mat-icon>
              </button>
            </header>
            <main (mouseenter)="showTranslation = true" (mouseleave)="showTranslation = false">
              <p *ngIf="!showTranslation">
                {{ (randomWord$ | async)?.word }}
              </p>
              <p *ngIf="showTranslation">
                {{ (randomWord$ | async)?.translate }}
              </p>
            </main>
          </mat-card>
        </ng-container>
      </main>
    </div>
  `,
  styles: [
    // language=scss
    `
      mat-card.result-card {
        margin-bottom: 0.5rem;

        p:nth-of-type(2) {
          padding-left: 1rem;
          font-weight: bolder;
        }
      }

      mat-card.random-word-card {
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          p {
            margin: 0;
          }

          button {
            width: 24px;
            height: 24px;
            line-height: 24px;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              line-height: 18px;
            }
          }
        }

        main {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;

          p {
            text-align: center;
            white-space: pre-wrap;
            font-size: 1.25rem;
          }
        }
      }
    `,
  ],
})
export class KoreanComponent implements OnDestroy {
  @ViewChild('searchInput') input!: ElementRef<HTMLInputElement>

  public loading$ = this.koreanService.loading$
  public disabled$ = this.koreanService.disabled$
  public randomWord$ = this.koreanService.randomWord$
  public results: DictionaryResult[] = []
  public showTranslation = false

  private subscription = new Subscription()

  constructor(public appBarService: AppBarService, private koreanService: KoreanService) {
    this.koreanService.getRandomWord()
    this.subscription.add(
      this.koreanService.loading$
        .pipe(
          filter(loading => !loading),
          delay(500),
          switchMap(() => fromEvent(this.input.nativeElement, 'input')),
          distinctUntilChanged(),
          debounceTime(500)
        )
        .subscribe(() => {
          const value = this.input.nativeElement.value
          if (!value) {
            this.results = []
          } else {
            this.results = this.koreanService.getTranslations(value)
          }
        })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  public refetch(): void {
    this.koreanService.fetchWordlist()
  }

  public getNewRandom(): void {
    this.koreanService.getRandomWord()
  }
}
