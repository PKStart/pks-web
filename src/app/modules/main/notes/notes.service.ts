import { Injectable } from '@angular/core'
import {
  CreateNoteRequest,
  DeleteNoteRequest,
  Note,
  NoteIdResponse,
  UpdateNoteRequest,
  UUID,
} from 'pks-common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { omit } from '../../../utils/objects'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'
import { LocalApiService } from '../../shared/services/local-api.service'

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
  constructor(
    private apiService: ApiService,
    private localApiService: LocalApiService,
    private notificationService: NotificationService
  ) {
    super(initialState)
    this.fetchNotes()
    this.testLocalApi()
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
        this.notificationService.showError('Could not fetch notes. ' + err.message)
        this.setState({ loading: false })
      },
    })
  }

  public testLocalApi(): void {
    this.setState({ loading: true })
    console.log('testing local api')
    this.localApiService.get('/linux/mpr/current-profile').subscribe({
      next: res => {
        console.log('local api call', res)
      },
      error: err => {
        this.notificationService.showError('Could not call local api. ' + err.message)
        this.setState({ loading: false })
      },
    })
  }

  public createNote(note: CreateNoteRequest): Observable<NoteIdResponse> {
    this.setState({ loading: true })
    return this.apiService.post<CreateNoteRequest, NoteIdResponse>(ApiRoutes.NOTES, note).pipe(
      tap(
        () => this.setState({ loading: false }),
        () => this.setState({ loading: false })
      )
    )
  }

  public updateNote(note: Note): Observable<NoteIdResponse> {
    this.setState({ loading: true })
    const request: UpdateNoteRequest = omit(note, ['createdAt', 'userId'])
    return this.apiService.put<UpdateNoteRequest, NoteIdResponse>(ApiRoutes.NOTES, request).pipe(
      tap(
        () => this.setState({ loading: false }),
        () => this.setState({ loading: false })
      )
    )
  }

  public deleteNote(id: UUID): Observable<NoteIdResponse> {
    this.setState({ loading: true })
    return this.apiService.delete<DeleteNoteRequest, NoteIdResponse>(ApiRoutes.NOTES, { id }).pipe(
      tap(
        () => this.setState({ loading: false }),
        () => this.setState({ loading: false })
      )
    )
  }
}
