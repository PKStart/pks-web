import { Injectable } from '@angular/core'
import {
  CreateShortcutRequest,
  DeleteShortcutRequest,
  Shortcut,
  ShortcutCategory,
  ShortcutIdResponse,
  UpdateShortcutRequest,
  UUID,
} from 'pks-common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'
import { ShortcutsByCategory } from './shortcuts.types'
import { distributeShortcuts } from './shortcuts.utils'

interface ShortcutState {
  allById: Record<UUID, Shortcut>
  shortcuts: ShortcutsByCategory
  loading: boolean
}

const initialState: ShortcutState = {
  allById: {},
  shortcuts: {
    [ShortcutCategory.TOP]: [],
    [ShortcutCategory.CODING]: [],
    [ShortcutCategory.GOOGLE]: [],
    [ShortcutCategory.FUN]: [],
    [ShortcutCategory.OTHERS]: [],
  },
  loading: false,
}

@Injectable({ providedIn: 'root' })
export class ShortcutsService extends Store<ShortcutState> {
  public shortcuts$ = this.select(state => state.shortcuts)
  public loading$ = this.select(state => state.loading)

  constructor(private apiService: ApiService, private notificationService: NotificationService) {
    super(initialState)
    this.fetchShortcuts()
  }

  public getById(id: UUID): Shortcut {
    return this.state.allById[id]
  }

  public fetchShortcuts(): void {
    this.setState({ loading: true })
    this.apiService.get<Shortcut[]>(ApiRoutes.SHORTCUTS).subscribe({
      next: res => {
        const { byCategory, byId } = distributeShortcuts(res)
        this.setState({
          allById: byId,
          shortcuts: byCategory,
          loading: false,
        })
      },
      error: err => {
        this.notificationService.showError('Could not fetch notes. ' + err.message)
        this.setState({ loading: false })
      },
    })
  }

  public createShortcut(request: CreateShortcutRequest): Observable<ShortcutIdResponse> {
    this.setState({ loading: true })
    return this.apiService
      .post<CreateShortcutRequest, ShortcutIdResponse>(ApiRoutes.SHORTCUTS, request)
      .pipe(
        tap({
          next: () => this.setState({ loading: false }),
          error: () => this.setState({ loading: false }),
        })
      )
  }

  public updateShortcut(request: UpdateShortcutRequest): Observable<ShortcutIdResponse> {
    this.setState({ loading: true })
    return this.apiService
      .put<UpdateShortcutRequest, ShortcutIdResponse>(ApiRoutes.SHORTCUTS, request)
      .pipe(
        tap({
          next: () => this.setState({ loading: false }),
          error: () => this.setState({ loading: false }),
        })
      )
  }

  public deleteShortcut(id: UUID): Observable<ShortcutIdResponse> {
    this.setState({ loading: true })
    return this.apiService
      .delete<DeleteShortcutRequest, ShortcutIdResponse>(ApiRoutes.SHORTCUTS, { id })
      .pipe(
        tap({
          next: () => this.setState({ loading: false }),
          error: () => this.setState({ loading: false }),
        })
      )
  }
}
