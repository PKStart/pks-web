import { Injectable } from '@angular/core'
import { LocalStore } from '../../../utils/store'
import { StoreKeys } from '../../../constants/constants'
import { SettingsStore } from '../../shared/services/settings.store'
import { StravaAuthService } from './strava-auth.service'
import { StravaApiService } from './strava-api.service'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  Cycling,
  CyclingChoreRequest,
  SetMonthlyGoalRequest,
  SetWeeklyGoalRequest,
  UUID,
} from 'pks-common'
import { ApiService } from '../../shared/services/api.service'
import { ApiRoutes } from '../../shared/services/api-routes'
import { NotificationService } from '../../shared/services/notification.service'
import { CyclingWidget } from './cycling.types'

interface CyclingState {
  loading: boolean
  disabled: boolean
  needAuth: boolean
  cyclingData: Cycling | null
  goalsOpen: boolean
  statsOpen: boolean
  choresOpen: boolean
}

const initialState: CyclingState = {
  loading: true,
  disabled: true,
  needAuth: false,
  cyclingData: null,
  goalsOpen: true,
  statsOpen: false,
  choresOpen: false,
}

@Injectable({ providedIn: 'root' })
export class CyclingService extends LocalStore<CyclingState> {
  public stravaOauthUrl = this.stravaAuthService.stravaOauthUrl
  public loading$ = combineLatest([
    this.stravaAuthService.loading$,
    this.stravaApiService.loading$,
    this.select(state => state.loading),
  ]).pipe(map(([authLoading, apiLoading]) => authLoading || apiLoading))
  public disabled$ = this.stravaAuthService.disabled$
  public needAuth$ = this.stravaAuthService.needAuth$
  public stravaAthleteData$ = this.stravaApiService.data$
  public cyclingData$ = this.select(state => state.cyclingData)
  public goalsOpen$ = this.select(state => state.goalsOpen)
  public statsOpen$ = this.select(state => state.statsOpen)
  public choresOpen$ = this.select(state => state.choresOpen)

  private stravaAuthToken: string | null = null

  constructor(
    private settingsStore: SettingsStore,
    private apiService: ApiService,
    private stravaAuthService: StravaAuthService,
    private stravaApiService: StravaApiService,
    private notificationService: NotificationService
  ) {
    super(StoreKeys.CYCLING, initialState)
    this.stravaAuthService.accessToken$.subscribe(token => {
      this.stravaAuthToken = token
    })
  }

  public exchangeOauthCodeToToken(code: string): void {
    this.stravaAuthService.exchangeOauthCodeToToken(code).subscribe(() => {
      this.fetchStravaData()
    })
  }

  public fetchStravaData(): void {
    if (!this.stravaAuthToken) return
    if (!this.stravaAuthService.isLoggedInToStrava) {
      this.stravaAuthService.refreshStravaToken().subscribe(res => {
        this.stravaApiService.getAthleteData(res.access_token)
      })
    } else {
      this.stravaApiService.getAthleteData(this.stravaAuthToken)
    }
  }

  public fetchCyclingData(): void {
    this.setState({ loading: true })
    this.apiService.get<Cycling>(ApiRoutes.CYCLING).subscribe({
      next: res => {
        this.setState({
          cyclingData: res,
          loading: false,
        })
      },
      error: err => {
        this.notificationService.showError('Could not fetch cycling data. ' + err.message)
        this.setState({ loading: false })
      },
    })
  }

  public setWeeklyGoal(goal: number): void {
    this.setState({ loading: true })
    this.apiService
      .put<SetWeeklyGoalRequest, Cycling>(ApiRoutes.CYCLING_WEEKLY_GOAL, { weeklyGoal: goal })
      .subscribe({
        next: res => {
          this.setState({
            cyclingData: res,
            loading: false,
          })
          this.notificationService.showSuccess('New weekly goal set!')
        },
        error: err => {
          this.notificationService.showError('Could not update weekly goal. ' + err.message)
          this.setState({ loading: false })
        },
      })
  }

  public setMonthlyGoal(goal: number): void {
    this.setState({ loading: true })
    this.apiService
      .put<SetMonthlyGoalRequest, Cycling>(ApiRoutes.CYCLING_MONTHLY_GOAL, { monthlyGoal: goal })
      .subscribe({
        next: res => {
          this.setState({
            cyclingData: res,
            loading: false,
          })
          this.notificationService.showSuccess('New monthly goal set!')
        },
        error: err => {
          this.notificationService.showError('Could not update monthly goal. ' + err.message)
          this.setState({ loading: false })
        },
      })
  }

  public addNewChore(data: CyclingChoreRequest): void {
    this.setState({ loading: true })
    this.apiService.post<CyclingChoreRequest, Cycling>(ApiRoutes.CYCLING_CHORE, data).subscribe({
      next: res => {
        this.setState({
          cyclingData: res,
          loading: false,
        })
        this.notificationService.showSuccess('New chore added!')
      },
      error: err => {
        this.notificationService.showError('Could not add new cycling chore. ' + err.message)
        this.setState({ loading: false })
      },
    })
  }

  public editChore(id: UUID, data: CyclingChoreRequest): void {
    this.setState({ loading: true })
    this.apiService
      .put<CyclingChoreRequest, Cycling>(`${ApiRoutes.CYCLING_CHORE}/${id}`, data)
      .subscribe({
        next: res => {
          this.setState({
            cyclingData: res,
            loading: false,
          })
          this.notificationService.showSuccess('Chore updated!')
        },
        error: err => {
          this.notificationService.showError('Could not update cycling chore. ' + err.message)
          this.setState({ loading: false })
        },
      })
  }

  public deleteChore(id: UUID): void {
    this.setState({ loading: true })
    this.apiService.delete<null, Cycling>(`${ApiRoutes.CYCLING_CHORE}/${id}`, null).subscribe({
      next: res => {
        this.setState({
          cyclingData: res,
          loading: false,
        })
        this.notificationService.showSuccess('Chore deleted!')
      },
      error: err => {
        this.notificationService.showError('Could not delete cycling chore. ' + err.message)
        this.setState({ loading: false })
      },
    })
  }

  public toggleWidget(widget: CyclingWidget): void {
    switch (widget) {
      case 'goals':
        this.setState({ goalsOpen: !this.state.goalsOpen })
        break
      case 'stats':
        this.setState({ statsOpen: !this.state.statsOpen })
        break
      case 'chores':
        this.setState({ choresOpen: !this.state.choresOpen })
        break
    }
  }
}
