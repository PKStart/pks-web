import { Component, OnDestroy } from '@angular/core'
import { combineLatest, Subscription } from 'rxjs'
import { AppBarService } from '../app-bar/app-bar.service'
import {
  CurrentWeather,
  HIGH_TEMP_WARNING_THRESHOLD,
  LOW_TEMP_WARNING_THRESHOLD,
} from './weather.types'
import { WeatherService } from './weather.service'

@Component({
  selector: 'pk-app-bar-weather',
  template: `
    <button mat-button class="wrapper" [matTooltip]="summary" (click)="onClick()">
      <ng-container *ngIf="loading$ | async">
        <mat-spinner diameter="24" color="accent"></mat-spinner>
      </ng-container>
      <ng-container *ngIf="(disabled$ | async) && (loading$ | async) === false">
        <mat-icon>block</mat-icon>
      </ng-container>
      <ng-container *ngIf="weather && (loading$ | async) === false">
        <mat-icon
          *ngIf="(weather.temperature ?? 0) > thresholds.high"
          class="weather-icon temp-high-warning"
          svgIcon="tempHighWarning"
        ></mat-icon>
        <mat-icon
          *ngIf="(weather.temperature ?? 0) < thresholds.low"
          class="weather-icon temp-low-warning"
          svgIcon="tempLowWarning"
        ></mat-icon>
        <span class="temperature">{{ weather.temperature }}&deg;C</span>
        <mat-icon class="weather-icon" [svgIcon]="weather.icon"></mat-icon>
      </ng-container>
    </button>
  `,
  styles: [
    `
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
      .temp-high-warning {
        color: var(--color-warn);
      }
      .temp-low-warning {
        color: var(--color-primary);
      }
      .weather-icon,
      .temperature {
        padding: 0.5rem;
      }
    `,
  ],
})
export class AppBarWeatherComponent implements OnDestroy {
  public thresholds = {
    high: HIGH_TEMP_WARNING_THRESHOLD,
    low: LOW_TEMP_WARNING_THRESHOLD,
  }
  public weather: CurrentWeather | undefined
  public summary: string = 'No weather data'
  public loading$ = this.weatherService.loading$
  public disabled$ = this.weatherService.disabled$

  private subscription = new Subscription()

  constructor(private weatherService: WeatherService, private appBarService: AppBarService) {
    this.subscription.add(
      combineLatest([weatherService.location$, weatherService.weather$]).subscribe(
        ([location, weather]) => {
          if (!location || !weather) return
          this.summary = `${location}: ${weather.current.description}`
          this.weather = weather.current
        }
      )
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  public onClick(): void {
    this.appBarService.toggleWeather()
  }
}
