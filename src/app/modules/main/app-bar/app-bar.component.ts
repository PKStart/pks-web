import { Component, Renderer2 } from '@angular/core'
import { LIGHT_THEME_CLASS } from '../../../constants/constants'
import { AuthService } from '../../auth/auth.service'
import { BirthdaysService } from '../birthdays/birthdays.service'
import { DataBackupService } from '../data-backup/data-backup.service'
import { SettingsService } from '../settings/settings-service'
import { AppBarService } from './app-bar.service'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'pk-app-bar',
  template: `
    <mat-toolbar>
      <a mat-icon-button matTooltip="P-kin.com" href="https://www.p-kin.com" target="_blank">
        <mat-icon class="p-logo-icon" svgIcon="pLogoColor"></mat-icon>
      </a>
      <span class="spacer"></span>
      <pk-app-bar-weather
        *ngIf="(appBarService.weatherOpen$ | async) === false"
      ></pk-app-bar-weather>
      <button
        mat-icon-button
        matTooltip="Notes"
        *ngIf="(appBarService.notesOpen$ | async) === false"
        (click)="appBarService.toggleNotes()"
      >
        <mat-icon>notes</mat-icon>
      </button>
      <button
        mat-icon-button
        matTooltip="Korean"
        *ngIf="(appBarService.koreanOpen$ | async) === false"
        (click)="appBarService.toggleKorean()"
      >
        <mat-icon svgIcon="hangul"></mat-icon>
      </button>
      <button
        mat-icon-button
        matTooltip="Personal data"
        *ngIf="(appBarService.personalDataOpen$ | async) === false"
        (click)="appBarService.togglePersonalData()"
      >
        <mat-icon>find_in_page</mat-icon>
      </button>
      <button
        mat-icon-button
        matTooltip="Birthdays"
        *ngIf="(appBarService.birthdaysOpen$ | async) === false"
        (click)="appBarService.toggleBirthdays()"
      >
        <mat-icon [matBadge]="birthdaysToday$ | async" matBadgeColor="accent" matBadgeSize="small">
          today
        </mat-icon>
      </button>
      <pk-notifications></pk-notifications>
      <button mat-icon-button matTooltip="More..." [matMenuTriggerFor]="menu">
        <mat-icon>more_horiz</mat-icon>
      </button>
      <mat-menu #menu="matMenu" class="app-bar__more-menu">
        <button mat-menu-item (click)="switchTheme()">
          <mat-icon>{{ isLightTheme ? 'dark_mode' : 'light_mode' }}</mat-icon>
          <span>{{ isLightTheme ? 'Dark theme' : 'Light theme' }}</span>
        </button>
        <button mat-menu-item (click)="requestBackup()">
          <mat-icon>cloud_download</mat-icon>
          <span>Data backup</span>
        </button>
        <button mat-menu-item (click)="openSettings()">
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Log out</span>
        </button>
        <mat-divider></mat-divider>
        <div class="version">v{{ version }}</div>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [
    //language=scss
    `
      mat-toolbar {
        border-bottom: 1px solid var(--color-primary);
      }
      .p-logo-icon {
        transform: scale(1.5);
      }
      .spacer {
        flex: 1 1 auto;
      }
      mat-divider {
        margin-top: 0.5rem;
      }
      .version {
        padding: 0.75rem 1rem 0.25rem;
        font-size: 0.65rem;
        text-align: right;
      }
    `,
  ],
})
export class AppBarComponent {
  public isLightTheme = false
  public birthdaysToday$ = this.birthdaysService.hasBirthdaysToday$
  public version = environment.version

  constructor(
    private authService: AuthService,
    private dataBackupService: DataBackupService,
    private birthdaysService: BirthdaysService,
    private settingsService: SettingsService,
    public appBarService: AppBarService,
    private renderer: Renderer2
  ) {}

  public switchTheme(): void {
    this.isLightTheme = !this.isLightTheme
    if (this.isLightTheme) {
      this.renderer.addClass(document.body, LIGHT_THEME_CLASS)
    } else {
      this.renderer.removeClass(document.body, LIGHT_THEME_CLASS)
    }
  }

  public logout(): void {
    this.authService.logout()
    location.reload()
  }

  public requestBackup(): void {
    this.dataBackupService.sendBackupRequest()
  }

  public openSettings(): void {
    this.settingsService.openDialog()
  }
}
