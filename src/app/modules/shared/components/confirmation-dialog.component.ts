import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'pk-confirmation-dialog',
  template: `
    <div mat-dialog-content>{{ data.message }}</div>
    <div mat-dialog-actions>
      <button mat-button data-test-id="confirmation-cancel-btn" (click)="onCancel()">CANCEL</button>
      <button mat-button data-test-id="confirmation-ok-btn" color="accent" (click)="onOk()">
        OK
      </button>
    </div>
  `,
  styles: [
    `
      div[mat-dialog-content] {
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class ConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  public onCancel(): void {
    this.dialogRef.close(false)
  }

  public onOk(): void {
    this.dialogRef.close(true)
  }
}
