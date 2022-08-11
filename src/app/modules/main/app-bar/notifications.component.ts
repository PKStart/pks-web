import { Component, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { SnackbarType } from '../../shared/components/snackbar.component'
import { Notification, NotificationService } from '../../shared/services/notification.service'

@Component({
  selector: 'pk-notifications',
  template: `
    <button
      *ngIf="notifications.length"
      mat-icon-button
      matTooltip="Notifications"
      [matMenuTriggerFor]="notificationsMenu"
    >
      <mat-icon [matBadge]="errors > 0 ? errors : ''" matBadgeColor="accent" matBadgeSize="small">
        notifications
      </mat-icon>
    </button>
    <mat-menu #notificationsMenu="matMenu" class="pk-notifications">
      <div *ngFor="let item of notifications" class="pk-notifications__item">
        <p>{{ item.message }}</p>
        <mat-icon *ngIf="item.type === SnackbarType.ERROR" style="color: var(--color-warn)">
          error
        </mat-icon>
        <mat-icon *ngIf="item.type === SnackbarType.WARNING" style="color: var(--color-accent)">
          warning
        </mat-icon>
        <mat-icon *ngIf="item.type === SnackbarType.SUCCESS" style="color: var(--color-primary)">
          check_circle
        </mat-icon>
        <span>{{ item.date | date: 'yyyy.M.d HH:mm' }}</span>
      </div>
      <button class="pk-notifications__clear-btn" mat-button (click)="onClear()">
        <mat-icon>delete_outline</mat-icon>
        Clear notifications
      </button>
    </mat-menu>
  `,
  styles: [``],
})
export class NotificationsComponent implements OnDestroy {
  public SnackbarType = SnackbarType
  public notifications: Notification[] = []
  public errors = 0

  private subscription = new Subscription()

  constructor(private notificationService: NotificationService) {
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.errors = notifications.filter(n => n.type === SnackbarType.ERROR).length
        this.notifications = notifications
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  public onClear(): void {
    this.notificationService.clearState()
  }
}
