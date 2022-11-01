import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pk-monthly-goal-dialog',
  template: `
    <h1 mat-dialog-title>Set Monthly Goal</h1>
    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="fill" class="text-field">
          <mat-label>Goal</mat-label>
          <input formControlName="monthlyGoal" matInput type="number" min="0" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>CLOSE</button>
      <button
        mat-button
        data-test-id="save-monthly-goal-btn"
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
export class MonthlyGoalDialogComponent {
  public form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<MonthlyGoalDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      monthlyGoal: [undefined, [Validators.required]],
    })
  }

  public onSave(): void {
    this.dialogRef.close({
      monthlyGoal: this.form.value.monthlyGoal || undefined,
    })
  }
}
