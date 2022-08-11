import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core'
import { Subscription } from 'rxjs'
import { WeatherService } from './weather.service'
import { HourlyWeather } from './weather.types'

@Component({
  selector: 'pk-hourly-weather',
  template: `
    <mat-card *ngIf="(loading$ | async) === false" (wheel)="onScroll($event)">
      <mat-card-content #content>
        <div class="hourly-wrapper">
          <div *ngFor="let hour of hourly" class="hour">
            <p class="time">{{ hour.time }}</p>
            <mat-icon [svgIcon]="hour?.icon || ''"></mat-icon>
            <p class="temp">{{ hour.temperature }}&deg;C</p>
            <div class="precip">
              <mat-icon svgIcon="precip" color="primary"></mat-icon>
              {{ hour.precipitation ?? '0mm' }}
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    // language=scss
    `
      mat-card-content {
        max-width: 100%;
        overflow-x: auto;
      }

      .hourly-wrapper {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }

      .hour {
        text-align: center;
      }

      p {
        margin: 0 0 0.5rem;
      }

      .time {
        font-size: 0.75rem;
        color: var(--color-accent);
      }

      .temp {
        font-size: 1rem;
      }

      .precip {
        font-size: 0.75rem;
        margin-bottom: 0.5rem;

        mat-icon {
          width: 12px;
          height: 12px;
          position: relative;
        }
      }
    `,
  ],
})
export class HourlyWeatherComponent implements OnDestroy {
  @ViewChild('content') content: ElementRef | undefined

  public hourly: HourlyWeather[] = []
  public loading$ = this.weatherService.loading$

  private subscription = new Subscription()

  constructor(private weatherService: WeatherService) {
    this.subscription.add(
      weatherService.weather$.subscribe(weather => {
        if (!weather) return
        this.hourly = weather.hourly
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  public onScroll(e: WheelEvent): void {
    if (!this.content) return
    e.preventDefault()
    if (e.deltaY > 0) this.content.nativeElement.scrollLeft += 60
    else this.content.nativeElement.scrollLeft -= 60
  }
}
