import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { CyclingChore } from 'pks-common'

@Component({
  selector: 'pk-note-dialog',
  template: `
    <h1 mat-dialog-title>{{ !data ? 'Add new note' : 'Edit note' }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input formControlName="name" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Interval (km)</mat-label>
          <input formControlName="kmInterval" matInput type="number" min="0" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Last km</mat-label>
          <input formControlName="lastKm" matInput type="number" min="0" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>CLOSE</button>
      <button
        mat-button
        data-test-id="save-chore-btn"
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
export class ChoreDialogComponent {
  public form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<ChoreDialogComponent, Partial<CyclingChore> | undefined>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: CyclingChore | undefined
  ) {
    this.form = formBuilder.group({
      name: [data ? data.name : undefined, Validators.required],
      kmInterval: [data ? data.kmInterval : undefined, Validators.required],
      lastKm: [data ? data.lastKm : undefined, Validators.required],
    })
  }

  public onSave(): void {
    this.dialogRef.close(this.form.value)
  }
}
