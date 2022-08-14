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
//
// @Injectable({ providedIn: 'root' })
// export class LocalApiService {
//   private readonly apiUrl = environment.PK_LOCAL_API_URL
//
//   constructor(private http: HttpClient) {}
//
//   public get<T>(path: string, options: RequestOptions = defaultOptions): Observable<T> {
//     return this.http.get<T>(`${this.apiUrl}${path}`, options)
//   }
//
//   public post<Q, T>(
//     path: string,
//     data: Q,
//     options: RequestOptions = defaultOptions
//   ): Observable<T> {
//     return this.http.post<T>(`${this.apiUrl}${path}`, data, options)
//   }
// }
