import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CyclingChore, UUID } from 'pks-common'
import { StravaBikeData } from '../cycling.types'

@Component({
  selector: 'pk-cycling-chores',
  template: `
    <div class="chores" *ngIf="bikeData && chores?.length">
      <mat-card *ngFor="let chore of chores">
        <mat-card-content>
          <p>
            Distance since the last <b>{{ chore.name }}</b
            >: {{ bikeData.distance - chore.lastKm | number: '1.0-1' }} km
          </p>
          <div class="progress-bar-line">
            <mat-progress-bar
              [color]="bikeData.distance - chore.lastKm >= chore.kmInterval ? 'warn' : 'accent'"
              [value]="(bikeData.distance - chore.lastKm) / (chore.kmInterval / 100)"
            ></mat-progress-bar>
            <mat-icon *ngIf="bikeData.distance - chore.lastKm >= chore.kmInterval" color="warn">
              warning
            </mat-icon>
          </div>
          <footer>
            <span class="details">
              {{ bikeData.distance - chore.lastKm | number: '1.0-1' }} / {{ chore.kmInterval }} km
            </span>
            <div class="actions">
              <button mat-icon-button (click)="edit.emit(chore.id)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="delete.emit(chore.id)">
                <mat-icon class="material-icons-outlined">delete</mat-icon>
              </button>
            </div>
          </footer>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      mat-card {
        margin-bottom: 0.5rem;
      }

      .progress-bar-line {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      footer {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-top: 0.5rem;

        .details {
          font-size: 0.75rem;
        }

        .actions {
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
    `,
  ],
})
export class ChoresComponent {
  @Input() chores!: CyclingChore[]
  @Input() bikeData!: StravaBikeData

  @Output() edit = new EventEmitter<UUID>()
  @Output() delete = new EventEmitter<UUID>()
}
