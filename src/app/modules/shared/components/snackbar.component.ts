import { Component, Inject } from '@angular/core'
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar'

export enum SnackbarType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
}

export interface SnackbarData {
  type: SnackbarType
  message: string
}

@Component({
  selector: 'pk-snackbar',
  template: `
    <div class="snackbar-wrapper">
      <mat-icon *ngIf="data.type === SnackbarType.SUCCESS">check_circle</mat-icon>
      <mat-icon *ngIf="data.type === SnackbarType.WARNING">warning</mat-icon>
      <mat-icon *ngIf="data.type === SnackbarType.ERROR">error</mat-icon>
      <p class="message">{{ data.message }}</p>
      <button mat-icon-button (click)="onClose()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [
    // language=scss
    `
      .snackbar-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;

        p.message {
          margin: 0;
          flex-grow: 1;
        }
      }
    `,
  ],
})
export class SnackbarComponent {
  public SnackbarType = SnackbarType

  constructor(
    private ref: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData
  ) {}

  public onClose(): void {
    this.ref.dismiss()
  }
}
