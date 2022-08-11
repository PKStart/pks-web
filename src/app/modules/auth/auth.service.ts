import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { differenceInHours, isAfter, parse } from 'date-fns'
import {
  LoginCodeRequest,
  LoginRequest,
  LoginResponse,
  TokenRefreshRequest,
  TokenResponse,
  UUID,
} from 'pks-common'
import { tap } from 'rxjs/operators'
import { StoreKeys } from '../../constants/constants'
import { omit } from '../../utils/objects'
import { AppBarService } from '../main/app-bar/app-bar.service'
import { ApiRoutes } from '../shared/services/api-routes'
import { ApiService } from '../shared/services/api.service'
import { NotificationService } from '../shared/services/notification.service'
import { SettingsStore } from '../shared/services/settings.store'
import { AuthState, AuthStore } from './auth.store'

@Injectable({ providedIn: 'root' })
export class AuthService {
  // @ts-ignore
  private refreshTimer: NodeJs.Timeout

  constructor(
    private authStore: AuthStore,
    private api: ApiService,
    private appBarService: AppBarService,
    private notificationService: NotificationService,
    private settingsStore: SettingsStore
  ) {}

  public get store(): AuthState {
    return Object.freeze({ ...this.authStore.current })
  }

  public requestLoginCode(email: string): Observable<void> {
    this.authStore.setEmail(email)
    // for testing purposes, since email authentication is hard to test
    if (email === 'main@test.com') return of(undefined)
    // ---
    return this.api.post<LoginCodeRequest, void>(ApiRoutes.USERS_LOGIN_CODE, { email })
  }

  public login(loginCode: string): Observable<LoginResponse> {
    const email = this.authStore.current.email
    if (!email) {
      throw new Error('Email was not saved in store!')
    }
    return this.api
      .post<LoginRequest, LoginResponse>(ApiRoutes.USERS_LOGIN, { email, loginCode })
      .pipe(
        tap((res: LoginResponse) => {
          const authInfo = omit(res, ['settings'])
          const { settings } = res
          this.authStore.setLogin(authInfo)
          this.settingsStore.setSettings(settings)
          const expires = parse(res.expiresAt as unknown as string)
          this.scheduleTokenRefresh(expires, res.id)
        })
      )
  }

  public logout(): void {
    this.authStore.setLogout()
    this.settingsStore.clearSettings()
    this.appBarService.resetState()
    this.unscheduleTokenRefresh()
    localStorage.removeItem(StoreKeys.BIRTHDAYS)
    localStorage.removeItem(StoreKeys.KOREAN)
  }

  public autoLogin(): void {
    const { expiresAt, id } = this.authStore.current
    const expires = parse(expiresAt as unknown as string)
    if (!expires || !id || isAfter(new Date(), expires)) {
      this.logout()
      return
    }
    this.scheduleTokenRefresh(expires, id)
  }

  private scheduleTokenRefresh(expiresAt: Date, userId: UUID): void {
    this.unscheduleTokenRefresh()
    const now = new Date()
    const hoursLeft = differenceInHours(expiresAt, now)
    if (hoursLeft < 48) {
      this.refreshToken(userId)
    } else {
      this.refreshTimer = setTimeout(() => {
        this.refreshToken(userId)
      }, (hoursLeft - 48) * 60 * 60 * 1000)
    }
  }

  private unscheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = undefined
    }
  }

  private refreshToken(userId: UUID): void {
    this.api
      .post<TokenRefreshRequest, TokenResponse>(ApiRoutes.USERS_TOKEN_REFRESH, { userId })
      .subscribe({
        next: res => {
          this.authStore.setNewToken(res)
          const expires = parse(res.expiresAt as unknown as string)
          this.scheduleTokenRefresh(expires, this.authStore.current.id!)
        },
        error: err => {
          this.notificationService.showError('Token refresh error: ' + err.error.message)
        },
      })
  }
}
