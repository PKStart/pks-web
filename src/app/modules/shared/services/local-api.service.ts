import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { ApiService } from './api.service'
import { AuthStore } from '../../auth/auth.store'

@Injectable({ providedIn: 'root' })
export class LocalApiService extends ApiService {
  constructor(http: HttpClient, authStore: AuthStore) {
    super(http, authStore)
    super.setApiUrl(environment.PK_LOCAL_API_URL)
  }
}
