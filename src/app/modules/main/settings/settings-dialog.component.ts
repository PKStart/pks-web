import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { UserSettings } from 'pks-common'
import { CustomValidators } from '../../../utils/validators'

@Component({
  selector: 'pk-settings-dialog',
  template: `
    <h1 mat-dialog-title>Settings</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill">
          <mat-label>LocationIQ API key</mat-label>
          <input formControlName="locationApiKey" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>OpenWeatherMap API key</mat-label>
          <input formControlName="weatherApiKey" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Shortcut tiles icon base URL</mat-label>
          <input formControlName="shortcutIconBaseUrl" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Birthdays Google Sheet URL</mat-label>
          <input formControlName="birthdaysUrl" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Korean Google Sheet URL</mat-label>
          <input formControlName="koreanUrl" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Strava Client ID</mat-label>
          <input formControlName="stravaClientId" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Strava Client Secret</mat-label>
          <input formControlName="stravaClientSecret" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Strava OAuth redirect URL</mat-label>
          <input formControlName="stravaRedirectUri" matInput type="text" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>CLOSE</button>
      <button
        mat-button
        data-test-id="save-note-btn"
        color="primary"
        [disabled]="form.invalid"
        (click)="onSave()"
      >
        SAVE
      </button>
    </div>
  `,
  styles: [``],
})
export class SettingsDialogComponent {
  public form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent, UserSettings | undefined>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: UserSettings
  ) {
    this.form = formBuilder.group({
      locationApiKey: [data.locationApiKey],
      weatherApiKey: [data.weatherApiKey],
      shortcutIconBaseUrl: [data.shortcutIconBaseUrl, CustomValidators.url],
      birthdaysUrl: [data.birthdaysUrl, CustomValidators.url],
      koreanUrl: [data.koreanUrl, CustomValidators.url],
      stravaClientId: [data.stravaClientId],
      stravaClientSecret: [data.stravaClientSecret],
      stravaRedirectUri: [data.stravaRedirectUri],
    })
  }

  public onSave(): void {
    this.dialogRef.close({ ...this.form.value })
  }
}
