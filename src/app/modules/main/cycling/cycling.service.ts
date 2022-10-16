import { Injectable } from '@angular/core'
import { LocalStore } from '../../../utils/store'
import { StoreKeys } from '../../../constants/constants'
import { SettingsStore } from '../../shared/services/settings.store'
import { StravaAuthService } from './strava-auth.service'
import { StravaApiService } from './strava-api.service'
import { combineLatest } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

interface CyclingState {
  loading: boolean
  disabled: boolean
  needAuth: boolean
}

const initialState: CyclingState = {
  loading: true,
  disabled: true,
  needAuth: false,
}

@Injectable({ providedIn: 'root' })
export class CyclingService extends LocalStore<CyclingState> {
  public stravaOauthUrl = this.stravaAuthService.stravaOauthUrl
  public loading$ = combineLatest([
    this.stravaAuthService.loading$,
    this.stravaApiService.loading$,
  ]).pipe(map(([authLoading, apiLoading]) => authLoading || apiLoading))
  public disabled$ = this.stravaAuthService.disabled$
  public needAuth$ = this.stravaAuthService.needAuth$
  public stravaAthleteData$ = this.stravaApiService.data$

  private stravaAuthToken: string | null = null

  constructor(
    private settingsStore: SettingsStore,
    private stravaAuthService: StravaAuthService,
    private stravaApiService: StravaApiService
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
}
