import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthData, UUID } from '@kinpeter/pk-common'
import { StoreKeys } from '../../constants/constants'
import { LocalStore } from '../../utils/store'

export interface AuthState {
  id: UUID | null
  email: string | null
  token: string | null
  expiresAt: Date | string | null
  isAuth: boolean
}

const initialState: AuthState = {
  id: null,
  email: null,
  expiresAt: null,
  token: null,
  isAuth: false,
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends LocalStore<AuthState> {
  public isAuth$: Observable<boolean> = this.select(state => state.isAuth)
  public email$: Observable<string | null> = this.select(state => state.email)

  constructor() {
    super(StoreKeys.AUTH, initialState)
  }

  public get isAuth(): boolean {
    return this.state.isAuth
  }

  public get current(): AuthState {
    return this.state
  }

  public setEmail(email: string): void {
    this.setState({ email })
  }

  public setLogin(res: AuthData): void {
    this.setState({
      id: res.id,
      email: res.email,
      token: res.token,
      expiresAt: res.expiresAt,
      isAuth: true,
    })
  }

  public setLogout(): void {
    this.setState({
      id: null,
      email: null,
      token: null,
      expiresAt: null,
      isAuth: false,
    })
  }

  public setNewToken({ token, expiresAt }: AuthData): void {
    this.setState({ token, expiresAt })
  }
}
