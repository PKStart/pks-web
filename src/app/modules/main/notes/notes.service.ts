import { Injectable } from '@angular/core'
import { NoteRequest, Note, IdObject, UUID } from '@kinpeter/pk-common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { omit } from '../../../utils/objects'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'
import { parseError } from '../../../utils/parse-error'

interface NotesState {
  notes: Note[]
  loading: boolean
}

const initialState: NotesState = {
  notes: [],
  loading: false,
}

@Injectable({ providedIn: 'root' })
export class NotesService extends Store<NotesState> {
  constructor(private apiService: ApiService, private notificationService: NotificationService) {
    super(initialState)
    this.fetchNotes()
  }

  public notes$ = this.select(state => state.notes)
  public loading$ = this.select(state => state.loading)

  public fetchNotes(): void {
    this.setState({ loading: true })
    this.apiService.get<Note[]>(ApiRoutes.NOTES).subscribe({
      next: res => {
        this.setState({
          notes: res,
          loading: false,
        })
      },
      error: err => {
        this.notificationService.showError('Could not fetch notes. ' + parseError(err))
        this.setState({ loading: false })
      },
    })
  }

  public createNote(note: NoteRequest): Observable<Note> {
    this.setState({ loading: true })
    return this.apiService.post<NoteRequest, Note>(ApiRoutes.NOTES, note).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    )
  }

  public updateNote(note: Note): Observable<Note> {
    this.setState({ loading: true })
    const request: NoteRequest = omit(note, ['createdAt', 'userId', 'id'])
    return this.apiService.put<NoteRequest, Note>(ApiRoutes.NOTES + `/${note.id}`, request).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    )
  }

  public deleteNote(id: UUID): Observable<IdObject> {
    this.setState({ loading: true })
    return this.apiService.delete<IdObject>(ApiRoutes.NOTES + `/${id}`).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    )
  }
}
