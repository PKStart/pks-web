import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '../../../utils/store'
import { SettingsStore } from '../../shared/services/settings.store'
import { NotificationService } from '../../shared/services/notification.service'
import { LocationIqResponse, SavedLocationInfo, Weather, WeatherResponse } from './weather.types'
import { isSimilarLocation, transformWeather } from './weather.utils'
import { StoreKeys } from '../../../constants/constants'
import { DatetimeStore } from '../../shared/services/datetime.store'

export interface WeatherState {
  location: string
  weather: Weather | undefined
  loading: boolean
  disabled: boolean
}

const initialState: WeatherState = {
  location: '',
  weather: undefined,
  loading: true,
  disabled: false,
}

@Injectable({ providedIn: 'root' })
export class WeatherService extends Store<WeatherState> {
  /**
   * API docs:
   * LocationIQ: https://locationiq.com/docs
   * OpenWeatherMap: https://openweathermap.org/api/one-call-api
   */
  private locationApiKey: string | null = null
  private weatherApiKey: string | null = null
  private coords: GeolocationCoordinates | undefined
  private fetchTimer = 0

  public location$ = this.select(state => state.location)
  public weather$ = this.select(state => state.weather)
  public loading$ = this.select(state => state.loading)
  public disabled$ = this.select(state => state.disabled)

  constructor(
    private http: HttpClient,
    private datetimeStore: DatetimeStore,
    private settingsStore: SettingsStore,
    private notificationService: NotificationService
  ) {
    super(initialState)
    settingsStore.apiKeys.subscribe(keys => {
      this.weatherApiKey = keys.weatherApiKey ?? null
      this.locationApiKey = keys.locationApiKey ?? null
      if (!keys.weatherApiKey || !keys.locationApiKey) {
        this.setState({ loading: false, disabled: true })
      }
    })
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => this.getLocation(position.coords),
        err => this.notificationService.showError(err.message)
      )
    }
  }

  public refetchWeather(): void {
    this.fetchWeather()
    this.setFetchTimer()
    this.datetimeStore.updateToday()
  }

  private getLocation(coords: GeolocationCoordinates): void {
    if (!this.locationApiKey) return
    const savedLocationForCoordinates: LocationIqResponse | null =
      this.getSavedLocationForCoords(coords)
    if (savedLocationForCoordinates) {
      this.onGetLocation(savedLocationForCoordinates, coords)
      return
    }
    this.http
      .get<LocationIqResponse>('https://eu1.locationiq.com/v1/reverse.php', {
        params: {
          // lat: 37.549615,
          // lon: 127.141532,
          key: this.locationApiKey,
          format: 'json',
          lat: coords.latitude,
          lon: coords.longitude,
        },
      })
      .subscribe({
        next: (res: LocationIqResponse) => this.onGetLocation(res, coords),
        error: err => this.notificationService.showError('Could not get location: ' + err.message),
      })
  }

  private onGetLocation(location: LocationIqResponse, coords: GeolocationCoordinates): void {
    this.setState({ loading: false })
    this.saveLocationForCoords(location, coords)
    this.coords = coords
    this.setState({
      location:
        location.address.city + (location.address.district ? `, ${location.address.district}` : ''),
    })
    this.fetchWeather()
    this.setFetchTimer()
  }

  private fetchWeather(): void {
    if (!this.weatherApiKey || !this.coords) return
    this.setState({ loading: true })
    this.http
      .get<WeatherResponse>('https://api.openweathermap.org/data/2.5/onecall', {
        params: {
          lat: this.coords.latitude,
          lon: this.coords.longitude,
          appId: this.weatherApiKey,
          exclude: 'minutely',
          units: 'metric',
        },
      })
      .subscribe({
        next: (res: WeatherResponse) => this.onGetWeather(res),
        error: err => {
          this.notificationService.showError('Could not get weather: ' + err.message)
          this.setState({ loading: false })
        },
      })
  }

  private onGetWeather(res: WeatherResponse): void {
    this.setState({ weather: transformWeather(res), loading: false })
  }

  private setFetchTimer(): void {
    if (this.fetchTimer) clearInterval(this.fetchTimer)
    this.fetchTimer = setInterval(() => this.fetchWeather(), 1000 * 60 * 60)
  }

  private getSavedLocationForCoords(coords: GeolocationCoordinates): LocationIqResponse | null {
    const savedLocationInfo = localStorage.getItem(StoreKeys.LOCATION)
    if (!savedLocationInfo) return null
    const { location, coords: savedCoords } = JSON.parse(savedLocationInfo) as SavedLocationInfo
    return isSimilarLocation(coords, savedCoords) ? location : null
  }

  private saveLocationForCoords(
    location: LocationIqResponse,
    geoCoords: GeolocationCoordinates
  ): void {
    const coords = { latitude: geoCoords.latitude, longitude: geoCoords.longitude }
    localStorage.setItem(StoreKeys.LOCATION, JSON.stringify({ location, coords }))
  }
}
