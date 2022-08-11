import { Injectable } from '@angular/core'
import {
  CreatePersonalDataRequest,
  DeletePersonalDataRequest,
  PersonalData,
  PersonalDataIdResponse,
  UpdatePersonalDataRequest,
  UUID,
} from 'pks-common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'

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
        this.notificationService.showError('Could not fetch personal data. ' + err.error.message)
        this.setState({ loading: false })
      },
    })
  }

  public createPersonalData(
    request: CreatePersonalDataRequest
  ): Observable<PersonalDataIdResponse> {
    this.setState({ loading: true })
    return this.apiService
      .post<CreatePersonalDataRequest, PersonalDataIdResponse>(ApiRoutes.PERSONAL_DATA, request)
      .pipe(
        tap(
          () => this.setState({ loading: false }),
          () => this.setState({ loading: false })
        )
      )
  }

  public updatePersonalData(
    request: UpdatePersonalDataRequest
  ): Observable<PersonalDataIdResponse> {
    this.setState({ loading: true })
    return this.apiService
      .put<UpdatePersonalDataRequest, PersonalDataIdResponse>(ApiRoutes.PERSONAL_DATA, request)
      .pipe(
        tap(
          () => this.setState({ loading: false }),
          () => this.setState({ loading: false })
        )
      )
  }

  public deletePersonalData(id: UUID): Observable<PersonalDataIdResponse> {
    this.setState({ loading: true })
    return this.apiService
      .delete<DeletePersonalDataRequest, PersonalDataIdResponse>(ApiRoutes.PERSONAL_DATA, {
        id,
      })
      .pipe(
        tap(
          () => this.setState({ loading: false }),
          () => this.setState({ loading: false })
        )
      )
  }
}
