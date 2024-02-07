import { Component, OnDestroy } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Note, UUID } from '@kinpeter/pk-common'
import { parseISO } from 'date-fns'
import { Subscription } from 'rxjs'
import { filter, map, switchMap } from 'rxjs/operators'
import { defaultDialogConfig } from '../../../constants/constants'
import { ConfirmationService } from '../../shared/services/confirmation.service'
import { NotificationService } from '../../shared/services/notification.service'
import { AppBarService } from '../app-bar/app-bar.service'
import { NoteDialogComponent } from './note-dialog.component'
import { NotesService } from './notes.service'
import { NoteToggleEvent } from './notes.types'
import { parseError } from '../../../utils/parse-error'

@Component({
  selector: 'pk-notes',
  template: ` <div class="main-box" [class.max-size]="notes.length > 4">
    <header class="main-box-header">
      <h1 class="main-box-title">Notes</h1>
      <div class="main-box-actions">
        <button
          mat-icon-button
          matTooltip="Add note"
          matTooltipPosition="left"
          (click)="onAddNote()"
        >
          <mat-icon>playlist_add</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Close" (click)="appBarService.toggleNotes()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </header>
    <main class="main-box-content">
      <div *ngIf="loading$ | async" class="main-box-loading">
        <mat-spinner diameter="32" color="accent"></mat-spinner>
      </div>
      <div *ngIf="(loading$ | async) === false && !notes.length" class="main-box-message">
        No notes.
      </div>
      <div class="notes" *ngIf="(loading$ | async) === false && notes.length">
        <pk-note-card
          *ngFor="let note of notes"
          [note]="note"
          (edit)="onEdit($event)"
          (pin)="onPin($event)"
          (archive)="onArchive($event)"
          (delete)="onDelete($event)"
        ></pk-note-card>
      </div>
    </main>
  </div>`,
  styles: [
    `
      .main-box {
        max-height: 900px;

        &.max-size {
          height: calc(100vh - 64px - 3rem);
        }
      }
      .notes {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
})
export class NotesComponent implements OnDestroy {
  public notes: Note[] = []
  public loading$ = this.notesService.loading$

  private subscription = new Subscription()

  constructor(
    public appBarService: AppBarService,
    private notesService: NotesService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private matDialog: MatDialog
  ) {
    this.subscription.add(
      notesService.notes$.subscribe(notes => {
        this.notes = notes
          .sort(
            (a, b) =>
              parseISO(b.createdAt as unknown as string).getTime() -
              parseISO(a.createdAt as unknown as string).getTime()
          )
          .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
          .sort((a, b) => (a.archived === b.archived ? 0 : a.archived ? 1 : -1))
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  public onAddNote(): void {
    this.matDialog
      .open(NoteDialogComponent, defaultDialogConfig)
      .afterClosed()
      .pipe(
        filter(values => values),
        map(values => ({
          ...values,
          text: values.text || null,
          links: values?.links?.length ? values.links : null,
        })),
        switchMap(request => this.notesService.createNote(request))
      )
      .subscribe({
        next: () => this.notesService.fetchNotes(),
        error: e => this.notificationService.showError('Could not create note. ' + parseError(e)),
      })
  }

  public onEdit(id: UUID): void {
    const note = this.notes.find(n => n.id === id)
    if (!note) return
    this.matDialog
      .open(NoteDialogComponent, { ...defaultDialogConfig, data: note })
      .afterClosed()
      .pipe(
        filter(values => values),
        map(values => ({
          ...note,
          ...values,
          text: values.text || null,
          links: values?.links?.length ? values.links : [],
        })),
        switchMap(request => this.notesService.updateNote(request))
      )
      .subscribe({
        next: () => this.notesService.fetchNotes(),
        error: e => this.notificationService.showError('Could not update note. ' + parseError(e)),
      })
  }

  public onPin(e: NoteToggleEvent): void {
    const note = this.notes.find(n => n.id === e.id)
    if (!note) return
    this.updateNote({ ...note, pinned: e.newValue })
  }

  public onArchive(e: NoteToggleEvent): void {
    const note = this.notes.find(n => n.id === e.id)
    if (!note) return
    this.updateNote({ ...note, archived: e.newValue })
  }

  public onDelete(id: UUID): void {
    this.confirmationService
      .question('Do you really want to delete this note?')
      .pipe(
        filter(isConfirmed => isConfirmed),
        switchMap(() => this.notesService.deleteNote(id))
      )
      .subscribe({
        next: () => this.notesService.fetchNotes(),
        error: e => this.notificationService.showError('Could not delete note. ' + parseError(e)),
      })
  }

  private updateNote(note: Note): void {
    this.notesService.updateNote(note).subscribe({
      next: () => this.notesService.fetchNotes(),
      error: e => this.notificationService.showError('Could not update note. ' + parseError(e)),
    })
  }
}
