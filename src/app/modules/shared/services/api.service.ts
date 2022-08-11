import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { AuthStore } from '../../auth/auth.store'

interface RequestOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[]
      }
  observe?: 'body'
  params?:
    | HttpParams
    | {
        [param: string]: string | string[]
      }
  reportProgress?: boolean
  responseType?: 'json'
  withCredentials?: boolean
  body?: any
}

const defaultOptions: RequestOptions = {
  observe: 'body',
  responseType: 'json',
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = environment.PK_API_URL

  constructor(private http: HttpClient, private auth: AuthStore) {}

  public get<T>(path: string, options: RequestOptions = defaultOptions): Observable<T> {
    this.setAuthorization(options)
    return this.http.get<T>(`${this.apiUrl}${path}`, options)
  }

  public async getAsync<T>(path: string, options: RequestOptions = defaultOptions): Promise<T> {
    return this.get<T>(path, options).toPromise()
  }

  public post<Q, T>(
    path: string,
    data: Q,
    options: RequestOptions = defaultOptions
  ): Observable<T> {
    this.setAuthorization(options)
    return this.http.post<T>(`${this.apiUrl}${path}`, data, options)
  }

  public async postAsync<Q, T>(
    path: string,
    data: Q,
    options: RequestOptions = defaultOptions
  ): Promise<T> {
    return this.post<Q, T>(path, data, options).toPromise()
  }

  public put<Q, T>(path: string, data: Q, options: RequestOptions = defaultOptions): Observable<T> {
    this.setAuthorization(options)
    return this.http.put<T>(`${this.apiUrl}${path}`, data, options)
  }

  public async putAsync<Q, T>(
    path: string,
    data: Q,
    options: RequestOptions = defaultOptions
  ): Promise<T> {
    return this.put<Q, T>(path, data, options).toPromise()
  }

  public delete<Q, T>(
    path: string,
    data: Q,
    options: RequestOptions = defaultOptions
  ): Observable<T> {
    this.setAuthorization(options)
    options.body = data || undefined
    return this.http.delete<T>(`${this.apiUrl}${path}`, options)
  }

  public async deleteAsync<Q, T>(
    path: string,
    data: Q,
    options: RequestOptions = defaultOptions
  ): Promise<T> {
    return this.delete<Q, T>(path, data, options).toPromise()
  }

  private setAuthorization(options: RequestOptions): void {
    if (!this.auth.isAuth || !this.auth.current.token) return
    const token = this.auth.current.token

    if (!options) {
      options = {
        ...defaultOptions,
      }
    }

    if (!options.headers) {
      options.headers = { Authorization: `Bearer ${token}` }
    } else if (options.headers instanceof HttpHeaders) {
      options.headers.set('Authorization', `Bearer ${token}`)
    } else {
      options.headers['Authorization'] = `Bearer ${token}`
    }
  }
}
