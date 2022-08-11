import { Component, Input, Output, EventEmitter } from '@angular/core'
import { Note, UUID } from 'pks-common'
import { NoteToggleEvent } from './notes.types'

@Component({
  selector: 'pk-note-card',
  template: `
    <mat-card [class.pinned]="note.pinned" [class.archived]="note.archived">
      <mat-card-content>
        <p *ngIf="note.text" class="note-text">{{ note.text }}</p>
        <ul *ngIf="note.links" class="links">
          <li *ngFor="let link of note.links">
            <mat-icon color="accent">link</mat-icon>
            <a [href]="link.url" target="_blank">{{ link.name }}</a>
          </li>
        </ul>
        <footer>
          <span class="date">{{ note.createdAt | date: 'yyyy.MM.dd H:mm' }}</span>
          <div class="actions">
            <button mat-icon-button (click)="edit.emit(note.id)">
              <mat-icon>edit_note</mat-icon>
            </button>
            <button
              mat-icon-button
              [disabled]="note.archived"
              (click)="pin.emit({ id: note.id, newValue: !note.pinned })"
            >
              <mat-icon [class.material-icons-outlined]="!note.pinned">push_pin</mat-icon>
            </button>
            <button
              *ngIf="!note.archived"
              mat-icon-button
              [disabled]="note.pinned"
              (click)="archive.emit({ id: note.id, newValue: true })"
            >
              <mat-icon class="material-icons-outlined">inventory_2</mat-icon>
            </button>
            <button
              *ngIf="note.archived"
              mat-icon-button
              (click)="archive.emit({ id: note.id, newValue: false })"
            >
              <mat-icon class="material-icons-outlined">unarchive</mat-icon>
            </button>
            <button mat-icon-button (click)="delete.emit(note.id)">
              <mat-icon class="material-icons-outlined">delete</mat-icon>
            </button>
          </div>
        </footer>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    // language=scss
    `
      mat-card.pinned {
        border: 1px solid var(--color-text);
      }

      mat-card.archived {
        opacity: 0.5;
      }

      .note-text {
        white-space: pre-wrap;
      }

      .links {
        list-style-type: none;
        padding: 0;

        mat-icon {
          position: relative;
          top: 6px;
          margin-right: 0.3rem;
        }
      }

      footer {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }

      .date {
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
    `,
  ],
})
export class NoteCardComponent {
  @Input() note!: Note

  @Output() pin = new EventEmitter<NoteToggleEvent>()
  @Output() archive = new EventEmitter<NoteToggleEvent>()
  @Output() edit = new EventEmitter<UUID>()
  @Output() delete = new EventEmitter<UUID>()

  constructor() {}
}
