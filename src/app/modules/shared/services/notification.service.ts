import { Injectable } from '@angular/core'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { Store } from '../../../utils/store'
import { SnackbarComponent, SnackbarType } from '../components/snackbar.component'

export const snackbarDefaultOptions: MatSnackBarConfig = {
  horizontalPosition: 'center',
  verticalPosition: 'top',
  duration: 3000,
}

export interface Notification {
  type: SnackbarType
  message: string
  date: Date
}

interface NotificationState {
  notifications: Notification[]
}

const initialState: NotificationState = {
  notifications: [],
}

@Injectable({ providedIn: 'root' })
export class NotificationService extends Store<NotificationState> {
  constructor(private snackBar: MatSnackBar) {
    super(initialState)
  }

  public notifications$ = this.select(state => state.notifications)

  public clearState(): void {
    this.setState({
      notifications: [],
    })
  }

  public showError(message: string): void {
    this.setState({
      notifications: [
        {
          type: SnackbarType.ERROR,
          date: new Date(),
          message,
        },
        ...this.state.notifications,
      ],
    })
    this.snackBar.openFromComponent(SnackbarComponent, {
      ...snackbarDefaultOptions,
      duration: 6000,
      panelClass: ['pk-snackbar', 'error'],
      data: {
        message,
        type: SnackbarType.ERROR,
      },
    })
  }

  public showWarning(message: string): void {
    this.setState({
      notifications: [
        {
          type: SnackbarType.WARNING,
          date: new Date(),
          message,
        },
        ...this.state.notifications,
      ],
    })
    this.snackBar.openFromComponent(SnackbarComponent, {
      ...snackbarDefaultOptions,
      panelClass: ['pk-snackbar', 'warning'],
      data: {
        message,
        type: SnackbarType.WARNING,
      },
    })
  }

  public showSuccess(message: string): void {
    this.setState({
      notifications: [
        {
          type: SnackbarType.SUCCESS,
          date: new Date(),
          message,
        },
        ...this.state.notifications,
      ],
    })
    this.snackBar.openFromComponent(SnackbarComponent, {
      ...snackbarDefaultOptions,
      panelClass: ['pk-snackbar', 'success'],
      data: {
        message,
        type: SnackbarType.SUCCESS,
      },
    })
  }
}
