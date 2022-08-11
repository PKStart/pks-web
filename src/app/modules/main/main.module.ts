import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { NotificationsComponent } from './app-bar/notifications.component'
import { BirthdaysComponent } from './birthdays/birthdays.component'
import { KoreanComponent } from './korean/korean.component'
import { MainComponent } from './main.component'
import { AppBarComponent } from './app-bar/app-bar.component'
import { NoteCardComponent } from './notes/note-card.component'
import { NoteDialogComponent } from './notes/note-dialog.component'
import { NotesComponent } from './notes/notes.component'
import { PersonalDataCardComponent } from './personal-data/personal-data-card.component'
import { PersonalDataDialogComponent } from './personal-data/personal-data-dialog.component'
import { PersonalDataComponent } from './personal-data/personal-data.component'
import { SettingsDialogComponent } from './settings/settings-dialog.component'
import { ShortcutDialogComponent } from './shortcuts/shortcut-dialog.component'
import { ShortcutComponent } from './shortcuts/shortcut.component'
import { ShortcutsMenuComponent } from './shortcuts/shortcuts-menu.component'
import { ShortcutsComponent } from './shortcuts/shortcuts.component'
import { AppBarWeatherComponent } from './weather/app-bar-weather.component'
import { CurrentWeatherComponent } from './weather/current-weather.component'
import { DailyWeatherComponent } from './weather/daily-weather.component'
import { HourlyWeatherComponent } from './weather/hourly-weather.component'
import { WeatherComponent } from './weather/weather.component'

@NgModule({
  imports: [SharedModule],
  exports: [],
  declarations: [
    MainComponent,
    AppBarComponent,
    AppBarWeatherComponent,
    WeatherComponent,
    CurrentWeatherComponent,
    DailyWeatherComponent,
    HourlyWeatherComponent,
    NotesComponent,
    NoteCardComponent,
    NoteDialogComponent,
    NotificationsComponent,
    ShortcutsComponent,
    ShortcutsMenuComponent,
    ShortcutComponent,
    ShortcutDialogComponent,
    BirthdaysComponent,
    SettingsDialogComponent,
    PersonalDataComponent,
    PersonalDataDialogComponent,
    PersonalDataCardComponent,
    KoreanComponent,
  ],
  providers: [],
})
export class MainModule {}
