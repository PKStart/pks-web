import { NgModule } from '@angular/core'
import { AppBarComponent } from './app-bar.component'
import { NotificationsComponent } from './notifications.component'
import { SharedModule } from '../../shared/shared.module'
import { WeatherModule } from '../weather/weather.module'

@NgModule({
  declarations: [AppBarComponent, NotificationsComponent],
  imports: [SharedModule, WeatherModule],
  exports: [AppBarComponent],
})
export class AppBarModule {}
