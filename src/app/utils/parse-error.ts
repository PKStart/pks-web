import { ApiError, ApiErrorMap } from '../constants/enums'

export function parseError(e: any): string {
  if (e.message) {
    return e.message
  }
  if (e.error.message) {
    return e.error.message
  }
  if (e.error.error) {
    const apiErrorCode = e.error.error
    if (ApiErrorMap.hasOwnProperty(apiErrorCode)) {
      return ApiErrorMap[apiErrorCode as ApiError]
    }
  }
  return JSON.stringify(e)
}
