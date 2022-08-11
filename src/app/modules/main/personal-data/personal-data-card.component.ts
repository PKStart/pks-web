import { Component, EventEmitter, Input, Output } from '@angular/core'
import { PersonalData, UUID } from 'pks-common'
import { NotificationService } from '../../shared/services/notification.service'

@Component({
  selector: 'pk-personal-data-card',
  template: `
    <mat-card>
      <mat-card-content>
        <header>
          <h1>{{ data.name }}</h1>
          <div class="actions">
            <button mat-icon-button (click)="onCopy()">
              <mat-icon *ngIf="!showCheckmark">content_copy</mat-icon>
              <mat-icon *ngIf="showCheckmark">check</mat-icon>
            </button>
            <button mat-icon-button (click)="edit.emit(data.id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="delete.emit(data.id)">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        </header>
        <p>{{ data.identifier }}</p>
        <p *ngIf="data.expiry">Expires: {{ data.expiry | date: 'YYYY.MM.dd' }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    // language=scss
    `
      mat-card {
        margin-bottom: 0.5rem;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h1 {
          font-size: 0.9rem;
          margin: 0;
        }

        .actions {
          display: flex;

          button {
            width: 24px;
            height: 24px;
            line-height: 24px;

            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              line-height: 18px;
            }
          }
        }
      }

      p {
        margin: 0.5rem 0;
      }
    `,
  ],
})
export class PersonalDataCardComponent {
  @Input() data!: PersonalData

  @Output() edit = new EventEmitter<UUID>()
  @Output() delete = new EventEmitter<UUID>()

  public showCheckmark = false

  constructor(private notificationService: NotificationService) {}

  public async onCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.data.identifier)
      this.showCheckmark = true
      setTimeout(() => {
        this.showCheckmark = false
      }, 3000)
    } catch (e) {
      this.notificationService.showError('Could not copy to clipboard.')
    }
  }
}
