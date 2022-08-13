import { Component, OnDestroy } from '@angular/core'
import { format } from 'date-fns'
import { Subscription } from 'rxjs'
import { WeatherService } from './weather.service'
import {
  CurrentWeather,
  DailyWeather,
  LOW_TEMP_WARNING_THRESHOLD,
  HIGH_TEMP_WARNING_THRESHOLD,
} from './weather.types'

@Component({
  selector: 'pk-current-weather',
  template: `
    <mat-card *ngIf="(loading$ | async) === false">
      <mat-card-content class="current-weather">
        <header>
          <p>{{ location }}</p>
          <p>{{ today }}</p>
        </header>
        <main>
          <div class="current-left">
            <p>
              <b>{{ current?.description }}</b>
            </p>
            <p>
              <mat-icon svgIcon="precip" color="primary"></mat-icon>
              {{ daily[0].precipitation ?? '0mm' }}
            </p>
            <p>
              <mat-icon svgIcon="wind" color="primary"></mat-icon>
              {{ current?.wind }}
            </p>
          </div>
          <div class="current-right">
            <div class="temps">
              <mat-icon
                *ngIf="(current?.temperature ?? 0) > thresholds.high"
                color="warn"
                svgIcon="tempHighWarning"
              ></mat-icon>
              <mat-icon
                *ngIf="(current?.temperature ?? 0) < thresholds.low"
                color="primary"
                svgIcon="tempLowWarning"
              ></mat-icon>
              <div class="degrees">
                <p>{{ current?.temperature }}&deg;C</p>
                <p>
                  <span>{{ daily[0].tempMax }}&deg;C</span>
                  <span>{{ daily[0].tempMin }}&deg;C</span>
                </p>
              </div>
            </div>
            <mat-icon [svgIcon]="current?.icon ?? ''"></mat-icon>
          </div>
        </main>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    // language=scss
    `
      mat-card {
        margin-bottom: 0.5rem;
      }

      .current-weather {
        header {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: 2rem;

          p {
            margin: 0;
          }
          p:first-child {
            font-weight: bold;
          }
        }

        main {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;

          .current-left {
            p {
              margin: 0 0 0.5rem;
              &:last-child {
                margin: 0;
              }
            }
            mat-icon {
              width: 16px;
              height: 16px;
              margin-right: 0.3rem;
              position: relative;
              top: 2px;
            }
          }
          .current-right {
            display: flex;
            align-items: center;
            gap: 1rem;

            p {
              margin: 0;
            }

            .temps {
              display: flex;
              align-items: center;
              gap: 1rem;

              mat-icon {
                width: 32px;
                height: 32px;
              }
            }

            .degrees {
              text-align: center;

              p:first-child {
                font-size: 2rem;
                font-weight: bold;
              }
              p:last-child {
                font-size: 1rem;
              }
              span:first-child {
                color: var(--color-warn);
                margin-right: 0.5rem;
              }
              span:last-child {
                color: var(--color-primary);
              }
            }

            > mat-icon {
              width: 52px;
              height: 52px;
            }
          }
        }
      }
    `,
  ],
})
export class CurrentWeatherComponent implements OnDestroy {
  public thresholds = {
    high: HIGH_TEMP_WARNING_THRESHOLD,
    low: LOW_TEMP_WARNING_THRESHOLD,
  }
  public loading$ = this.weatherService.loading$
  public location = ''
  public today = format(new Date(), 'dddd, yyyy MMMM D')
  public current: CurrentWeather | undefined
  public daily: DailyWeather[] = []
  private subscription = new Subscription()

  constructor(private weatherService: WeatherService) {
    this.subscription.add(
      weatherService.location$.subscribe(location => {
        this.location = location
      })
    )
    this.subscription.add(
      weatherService.weather$.subscribe(weather => {
        if (!weather) return
        this.current = weather.current
        this.daily = weather.daily
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
