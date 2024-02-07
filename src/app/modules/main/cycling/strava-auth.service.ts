import { LocalStore } from '../../../utils/store'
import { StoreKeys } from '../../../constants/constants'
import { HttpClient } from '@angular/common/http'
import { NotificationService } from '../../shared/services/notification.service'
import { PkStartSettings } from '@kinpeter/pk-common'
import { SettingsStore } from '../../shared/services/settings.store'
import { StravaAuthResponse } from './cycling.types'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Injectable } from '@angular/core'

interface StravaAuthState {
  loading: boolean
  disabled: boolean
  needAuth: boolean
  accessToken: string | null
  refreshToken: string | null
  tokenExpiresAt: number | null
  athleteId: number | null
}

const initialState: StravaAuthState = {
  loading: true,
  disabled: true,
  needAuth: false,
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  athleteId: null,
}

@Injectable({ providedIn: 'root' })
export class StravaAuthService extends LocalStore<StravaAuthState> {
  private readonly stravaAuthBaseUrl = 'https://www.strava.com/oauth/authorize'
  private readonly stravaAuthTokenUrl = 'https://www.strava.com/oauth/token'

  private stravaSettings: Partial<PkStartSettings> | undefined

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private settingsStore: SettingsStore
  ) {
    super(StoreKeys.STRAVA_AUTH, initialState)
    this.settingsStore.stravaSettings.subscribe(settings => {
      if (!settings.stravaClientId || !settings.stravaClientSecret) {
        this.setState({
          loading: false,
          disabled: true,
          accessToken: null,
          refreshToken: null,
          tokenExpiresAt: null,
          athleteId: null,
        })
        return
      }
      this.stravaSettings = settings
      if (this.state.accessToken && !this.isLoggedInToStrava) {
        this.refreshStravaToken().subscribe()
      } else if (!this.state.accessToken) {
        this.setState({ disabled: false, needAuth: true, loading: false })
      } else if (this.isLoggedInToStrava) {
        this.setState({ disabled: false, needAuth: false, loading: false })
      }
    })
  }

  public loading$ = this.select(state => state.loading)
  public disabled$ = this.select(state => state.disabled)
  public needAuth$ = this.select(state => state.needAuth)
  public accessToken$ = this.select(state => state.accessToken)

  public get stravaOauthUrl(): string {
    if (!this.stravaSettings) return ''
    const { stravaClientId, stravaRedirectUri } = this.stravaSettings
    return `${this.stravaAuthBaseUrl}?client_id=${stravaClientId}&redirect_uri=${stravaRedirectUri}&response_type=code&scope=read_all,activity:read_all,profile:read_all`
  }

  public exchangeOauthCodeToToken(code: string): Observable<StravaAuthResponse | null> {
    if (!this.stravaSettings) return of(null)
    const { stravaClientId, stravaClientSecret } = this.stravaSettings
    this.setState({ loading: true })
    return this.http
      .post<StravaAuthResponse>(
        `${this.stravaAuthTokenUrl}?client_id=${stravaClientId}&client_secret=${stravaClientSecret}&code=${code}&grant_type=authorization_code`,
        null
      )
      .pipe(
        tap({
          next: res => {
            console.log('strava auth', res)
            this.setState({
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              tokenExpiresAt: res.expires_at,
              athleteId: res.athlete.id,
              loading: false,
              needAuth: false,
            })
          },
          error: () => {
            this.notificationService.showError('Could not get auth token from Strava')
            this.setState({ loading: false, disabled: true })
          },
        })
      )
  }

  public refreshStravaToken(): Observable<StravaAuthResponse> {
    if (!this.stravaSettings) throw new Error('No Strava settings found')
    const { stravaClientId, stravaClientSecret } = this.stravaSettings

    const refreshToken = this.state.refreshToken
    this.setState({ loading: true })

    return this.http
      .post<StravaAuthResponse>(
        `${this.stravaAuthTokenUrl}?client_id=${stravaClientId}&client_secret=${stravaClientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`,
        null
      )
      .pipe(
        tap({
          next: res => {
            console.log('strava token refresh', res)
            this.setState({
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              tokenExpiresAt: res.expires_at,
              loading: false,
              needAuth: false,
            })
          },
          error: () => {
            this.notificationService.showError('Could not refresh token with Strava')
            this.setState({ loading: false, disabled: true })
          },
        })
      )
  }

  public get isLoggedInToStrava(): boolean {
    const { accessToken, tokenExpiresAt } = this.state
    if (!accessToken || !tokenExpiresAt) return false
    const now = new Date()
    const expiry = new Date(tokenExpiresAt * 1000)
    return now < expiry
  }
}
