export enum ApiRoutes {
  USERS = '/users',
  USERS_SIGNUP = '/users/signup',
  USERS_LOGIN_CODE = '/users/login-code',
  USERS_LOGIN = '/users/login',
  USERS_SETTINGS = '/users/settings',
  USERS_TOKEN_REFRESH = '/users/token-refresh',
  USERS_DATA_BACKUP = '/users/data-backup',
  SHORTCUTS = '/shortcuts',
  NOTES = '/notes',
  PERSONAL_DATA = '/personal-data',
  PROXY_BIRTHDAYS = '/proxy/birthdays',
  PROXY_KOREAN = '/proxy/korean',
  CYCLING = '/cycling',
  CYCLING_WEEKLY_GOAL = '/cycling/weekly-goal',
  CYCLING_MONTHLY_GOAL = '/cycling/monthly-goal',
  CYCLING_CHORE = '/cycling/chore',
  WAKEUP = '/wakeup',
}

export const publicApiRoutes = [
  ApiRoutes.USERS_SIGNUP,
  ApiRoutes.USERS_LOGIN_CODE,
  ApiRoutes.USERS_LOGIN,
  ApiRoutes.WAKEUP,
]

export const authenticatedApiRoutes = [
  ApiRoutes.USERS,
  ApiRoutes.USERS_TOKEN_REFRESH,
  ApiRoutes.USERS_DATA_BACKUP,
  ApiRoutes.USERS_SETTINGS,
  ApiRoutes.SHORTCUTS,
  ApiRoutes.NOTES,
  ApiRoutes.PERSONAL_DATA,
  ApiRoutes.PROXY_BIRTHDAYS,
  ApiRoutes.PROXY_KOREAN,
  ApiRoutes.CYCLING,
  ApiRoutes.CYCLING_CHORE,
  ApiRoutes.CYCLING_MONTHLY_GOAL,
  ApiRoutes.CYCLING_WEEKLY_GOAL,
]
