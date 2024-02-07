import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { Shortcut } from '@kinpeter/pk-common'
import { ShortcutCategory } from '../../../constants/enums'
import { CustomValidators } from '../../../utils/validators'

@Component({
  selector: 'pk-shortcut-dialog',
  template: `
    <h1 mat-dialog-title>{{ !data ? 'Add new shortcut' : 'Edit ' + data.name }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input formControlName="name" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>URL</mat-label>
          <input formControlName="url" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Icon URL / filename</mat-label>
          <input formControlName="iconUrl" matInput type="text" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option *ngFor="let category of categories" [value]="category">{{
              category
            }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-label class="priority-label">Priority: {{ form.value.priority }}</mat-label>
        <mat-slider min="1" max="10" thumbLabel step="1" formControlName="priority"></mat-slider>
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
  styles: [
    `
      .priority-label {
        padding-left: 0.5rem;
      }

      mat-slider {
        margin-top: 1rem;
        width: 100%;
      }
    `,
  ],
})
export class ShortcutDialogComponent {
  public form: FormGroup
  public categories = Object.values(ShortcutCategory)

  constructor(
    private dialogRef: MatDialogRef<ShortcutDialogComponent, Partial<Shortcut> | undefined>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Shortcut | undefined
  ) {
    this.form = formBuilder.group({
      name: [data ? data.name : undefined, [Validators.required]],
      url: [data ? data.url : undefined, [Validators.required, CustomValidators.url]],
      iconUrl: [data ? data.iconUrl : undefined, [Validators.required]],
      category: [data ? data.category : ShortcutCategory.OTHERS],
      priority: [data ? data.priority : 1],
    })
  }

  public onSave(): void {
    this.dialogRef.close({
      ...this.form.value,
    })
  }
}
