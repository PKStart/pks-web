import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiRoutes } from './api-routes'
import { ApiService } from './api.service'

@Injectable({ providedIn: 'root' })
export class ApiWakeupService {
  constructor(private api: ApiService) {}

  public wakeUp(): Observable<{ result: string }> {
    return this.api.get<{ result: string }>(ApiRoutes.WAKEUP)
  }
}
