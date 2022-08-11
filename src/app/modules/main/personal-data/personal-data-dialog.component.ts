import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { PersonalData } from 'pks-common'

@Component({
  selector: 'pk-personal-data-dialog',
  template: `
    <h1 mat-dialog-title>{{ data ? 'Edit ' + data.name : 'Add new document' }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill">
          <mat-label>Document name</mat-label>
          <input formControlName="name" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Identifier</mat-label>
          <input formControlName="identifier" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Date of expiry</mat-label>
          <input formControlName="expiry" matInput type="text" />
          <mat-hint>Format: YYYY-MM-DD</mat-hint>
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
export class PersonalDataDialogComponent {
  public form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<PersonalDataDialogComponent, Partial<PersonalData> | undefined>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: PersonalData | undefined
  ) {
    this.form = formBuilder.group({
      name: [data ? data.name : undefined, [Validators.required]],
      identifier: [data ? data.identifier : undefined, [Validators.required]],
      expiry: [data ? data.expiry : undefined],
    })
  }

  public onSave(): void {
    this.dialogRef.close({ ...this.form.value })
  }
}
