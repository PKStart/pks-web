import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ConfirmationDialogComponent } from '../components/confirmation-dialog.component'

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  constructor(private matDialog: MatDialog) {}

  public question(message: string): Observable<boolean> {
    return this.matDialog
      .open(ConfirmationDialogComponent, {
        data: { message },
        width: '400px',
        maxWidth: '90%',
        disableClose: true,
        autoFocus: true,
      })
      .afterClosed()
  }
}
