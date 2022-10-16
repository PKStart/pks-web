import { NgModule } from '@angular/core'
import { NoteCardComponent } from './note-card.component'
import { NoteDialogComponent } from './note-dialog.component'
import { NotesComponent } from './notes.component'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [NoteCardComponent, NoteDialogComponent, NotesComponent],
  imports: [SharedModule],
  exports: [NotesComponent],
})
export class NotesModule {}
