import { NgModule } from '@angular/core'
import { SharedModule } from '../../shared/shared.module'
import { WeatherComponent } from './weather.component'
import { AppBarWeatherComponent } from './app-bar-weather.component'
import { CurrentWeatherComponent } from './current-weather.component'
import { DailyWeatherComponent } from './daily-weather.component'
import { HourlyWeatherComponent } from './hourly-weather.component'

@NgModule({
  declarations: [
    AppBarWeatherComponent,
    CurrentWeatherComponent,
    DailyWeatherComponent,
    HourlyWeatherComponent,
    WeatherComponent,
  ],
  imports: [SharedModule],
  exports: [WeatherComponent, AppBarWeatherComponent],
})
export class WeatherModule {}
