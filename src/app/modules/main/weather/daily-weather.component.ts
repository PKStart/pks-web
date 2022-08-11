import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { WeatherService } from './weather.service'
import { DailyWeather } from './weather.types'

@Component({
  selector: 'pk-daily-weather',
  template: `
    <mat-card *ngIf="(loading$ | async) === false">
      <mat-card-content>
        <div *ngFor="let day of daily" class="day">
          <div class="day-left">
            <p>
              <b>{{ day.dayOfWeek }}</b>
            </p>
            <p>{{ day.date }}</p>
          </div>
          <div class="day-right">
            <div class="precip">
              <mat-icon svgIcon="precip" color="primary"></mat-icon>
              {{ day.precipitation ?? '0mm' }}
            </div>
            <span>{{ day.tempMax }}&deg;C</span>
            <span>{{ day.tempMin }}&deg;C</span>
            <mat-icon [svgIcon]="day.icon"></mat-icon>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    // language=scss
    `
      mat-card {
        margin-bottom: 0.5rem;
      }

      .day {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        padding: 0.5rem;

        &:not(:first-of-type) {
          border-top: 2px solid var(--color-text);
        }

        .day-left {
          p:first-child {
            margin: 0 0 0.5rem;
          }
          p:last-child {
            margin: 0;
          }
        }

        .day-right {
          display: flex;
          align-items: center;

          .precip {
            margin-right: 1rem;

            mat-icon {
              width: 16px;
              height: 16px;
              margin-right: 0.3rem;
              position: relative;
              top: 2px;
            }
          }
          span {
            font-size: 1.25rem;
            margin-right: 0.5rem;

            &:first-of-type {
              color: var(--color-warn);
            }
            &:last-of-type {
              color: var(--color-primary);
            }
          }

          > mat-icon {
            width: 36px;
            height: 36px;
            margin-left: 0.5rem;
          }
        }
      }
    `,
  ],
})
export class DailyWeatherComponent implements OnDestroy {
  public daily: DailyWeather[] = []
  public loading$ = this.weatherService.loading$

  private subscription = new Subscription()

  constructor(private weatherService: WeatherService) {
    this.subscription.add(
      weatherService.weather$.subscribe(weather => {
        if (!weather) return
        this.daily = weather.daily.slice(1, weather.daily.length - 1)
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
