import { NgModule } from '@angular/core'
import { AppBarModule } from './app-bar/app-bar.module'
import { BirthdaysModule } from './birthdays/birthdays.module'
import { CyclingModule } from './cycling/cycling.module'
import { KoreanModule } from './korean/korean.module'
import { MouseProfilesModule } from './mouse-profiles/mouse-profiles.module'
import { NotesModule } from './notes/notes.module'
import { PersonalDataModule } from './personal-data/personal-data.module'
import { SettingsModule } from './settings/settings.module'
import { SharedModule } from '../shared/shared.module'
import { ShortcutsModule } from './shortcuts/shortcuts.module'
import { WeatherModule } from './weather/weather.module'
import { MainComponent } from './main.component'

@NgModule({
  imports: [
    AppBarModule,
    BirthdaysModule,
    CyclingModule,
    KoreanModule,
    MouseProfilesModule,
    NotesModule,
    PersonalDataModule,
    SettingsModule,
    SharedModule,
    ShortcutsModule,
    WeatherModule,
  ],
  exports: [],
  declarations: [MainComponent],
  providers: [],
})
export class MainModule {}
