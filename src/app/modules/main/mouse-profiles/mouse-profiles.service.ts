import { Injectable } from '@angular/core'
import { ChangeProfileRequest, GameProfile, MprData } from 'pks-common'
import { Store } from '../../../utils/store'
import { NotificationService } from '../../shared/services/notification.service'
import { LocalApiService } from '../../shared/services/local-api.service'
import { LocalApiRoutes } from '../../shared/services/local-api-routes'

interface MouseProfilesState {
  profiles: GameProfile[]
  activeProfile: number | null
  configuredGame: GameProfile | null
  loading: boolean
  disabled: boolean
}

const initialState: MouseProfilesState = {
  profiles: [],
  activeProfile: null,
  configuredGame: null,
  loading: false,
  disabled: true,
}

@Injectable({ providedIn: 'root' })
export class MouseProfilesService extends Store<MouseProfilesState> {
  // @ts-ignore
  private timer: NodeJS.Timer | undefined

  constructor(
    private localApiService: LocalApiService,
    private notificationService: NotificationService
  ) {
    super(initialState)
    this.fetchProfiles()
  }

  public profiles$ = this.select(state => state.profiles)
  public activeProfile$ = this.select(state => state.activeProfile)
  public configuredGame$ = this.select(state => state.configuredGame)
  public loading$ = this.select(state => state.loading)
  public disabled$ = this.select(state => state.disabled)

  public fetchProfiles(): void {
    this.setState({ loading: true })
    this.localApiService.get<MprData>(LocalApiRoutes.MPR_CURRENT_STATE).subscribe({
      next: res => {
        this.setState({
          profiles: res.profiles,
          activeProfile: res.activeProfile,
          configuredGame: res.configuredGame,
          loading: false,
          disabled: false,
        })
        if (!this.timer) {
          this.timer = setInterval(() => this.fetchProfiles(), 1000 * 30)
        }
      },
      error: err => {
        this.notificationService.showError(
          'Could not fetch mouse profiles. ' + (err?.error?.message ?? err?.message)
        )
        this.setState({ loading: false, disabled: true })
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = undefined
        }
      },
    })
  }

  public changeProfile(request: ChangeProfileRequest): void {
    this.setState({ loading: true })
    this.localApiService
      .post<ChangeProfileRequest, MprData>(LocalApiRoutes.MPR_CHANGE_PROFILE, request)
      .subscribe({
        next: res =>
          this.setState({
            profiles: res.profiles,
            activeProfile: res.activeProfile,
            configuredGame: res.configuredGame,
            loading: false,
            disabled: false,
          }),
        error: err => {
          this.notificationService.showError(
            'Could not change mouse profile. ' + (err?.error?.message ?? err.message)
          )
          this.setState({ loading: false, disabled: true })
        },
      })
  }
}
