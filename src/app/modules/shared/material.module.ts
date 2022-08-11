import { NgModule } from '@angular/core'
import { MatBadgeModule } from '@angular/material/badge'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatChipsModule } from '@angular/material/chips'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSliderModule } from '@angular/material/slider'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DomSanitizer } from '@angular/platform-browser'
import { google } from '../../../assets/icons/google'
import { hangul } from '../../../assets/icons/hangul'
import { pLogo, pLogoColor } from '../../../assets/icons/p-logo'
import {
  clearDay,
  clearNight,
  cloudy,
  fog,
  hail,
  partlyCloudyDay,
  partlyCloudyNight,
  precip,
  rain,
  sleet,
  snow,
  tempHighWarning,
  tempLowWarning,
  thunderstorm,
  wind,
} from '../../../assets/icons/weather'

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatTooltipModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSliderModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatTooltipModule,
    MatRadioModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSliderModule,
  ],
  providers: [],
})
export class AngularMaterialModule {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    matIconRegistry
      .addSvgIconLiteral('pLogo', domSanitizer.bypassSecurityTrustHtml(pLogo))
      .addSvgIconLiteral('pLogoColor', domSanitizer.bypassSecurityTrustHtml(pLogoColor))
      .addSvgIconLiteral('hangul', domSanitizer.bypassSecurityTrustHtml(hangul))
      .addSvgIconLiteral('clearDay', domSanitizer.bypassSecurityTrustHtml(clearDay))
      .addSvgIconLiteral('clearNight', domSanitizer.bypassSecurityTrustHtml(clearNight))
      .addSvgIconLiteral('cloudy', domSanitizer.bypassSecurityTrustHtml(cloudy))
      .addSvgIconLiteral('fog', domSanitizer.bypassSecurityTrustHtml(fog))
      .addSvgIconLiteral('hail', domSanitizer.bypassSecurityTrustHtml(hail))
      .addSvgIconLiteral('tempHighWarning', domSanitizer.bypassSecurityTrustHtml(tempHighWarning))
      .addSvgIconLiteral('tempLowWarning', domSanitizer.bypassSecurityTrustHtml(tempLowWarning))
      .addSvgIconLiteral('partlyCloudyDay', domSanitizer.bypassSecurityTrustHtml(partlyCloudyDay))
      .addSvgIconLiteral(
        'partlyCloudyNight',
        domSanitizer.bypassSecurityTrustHtml(partlyCloudyNight)
      )
      .addSvgIconLiteral('precip', domSanitizer.bypassSecurityTrustHtml(precip))
      .addSvgIconLiteral('rain', domSanitizer.bypassSecurityTrustHtml(rain))
      .addSvgIconLiteral('sleet', domSanitizer.bypassSecurityTrustHtml(sleet))
      .addSvgIconLiteral('snow', domSanitizer.bypassSecurityTrustHtml(snow))
      .addSvgIconLiteral('thunderstorm', domSanitizer.bypassSecurityTrustHtml(thunderstorm))
      .addSvgIconLiteral('wind', domSanitizer.bypassSecurityTrustHtml(wind))
      .addSvgIconLiteral('google', domSanitizer.bypassSecurityTrustHtml(google))
  }
}
