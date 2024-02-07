import { Injectable } from '@angular/core'
import { PersonalDataRequest, PersonalData, IdObject, UUID } from '@kinpeter/pk-common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'
import { parseError } from '../../../utils/parse-error'

interface PersonalDataState {
  loading: boolean
  data: PersonalData[]
}

const initialState: PersonalDataState = {
  loading: false,
  data: [],
}

@Injectable({ providedIn: 'root' })
export class PersonalDataService extends Store<PersonalDataState> {
  public loading$ = this.select(state => state.loading)
  public data$ = this.select(state => state.data)

  constructor(private apiService: ApiService, private notificationService: NotificationService) {
    super(initialState)
    this.fetchData()
  }

  public fetchData(): void {
    this.setState({ loading: true })
    this.apiService.get<PersonalData[]>(ApiRoutes.PERSONAL_DATA).subscribe({
      next: res => {
        this.setState({
          data: res,
          loading: false,
        })
      },
      error: err => {
        this.notificationService.showError('Could not fetch personal data. ' + parseError(err))
        this.setState({ loading: false })
      },
    })
  }

  public createPersonalData(request: PersonalDataRequest): Observable<PersonalData> {
    this.setState({ loading: true })
    return this.apiService
      .post<PersonalDataRequest, PersonalData>(ApiRoutes.PERSONAL_DATA, request)
      .pipe(
        tap({
          next: () => this.setState({ loading: false }),
          error: () => this.setState({ loading: false }),
        })
      )
  }

  public updatePersonalData(request: PersonalDataRequest, id: UUID): Observable<PersonalData> {
    this.setState({ loading: true })
    return this.apiService
      .put<PersonalDataRequest, PersonalData>(ApiRoutes.PERSONAL_DATA + `/${id}`, request)
      .pipe(
        tap({
          next: () => this.setState({ loading: false }),
          error: () => this.setState({ loading: false }),
        })
      )
  }

  public deletePersonalData(id: UUID): Observable<IdObject> {
    this.setState({ loading: true })
    return this.apiService.delete<IdObject>(ApiRoutes.PERSONAL_DATA + `/${id}`).pipe(
      tap({
        next: () => this.setState({ loading: false }),
        error: () => this.setState({ loading: false }),
      })
    )
  }
}
