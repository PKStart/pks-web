export enum WeatherIcons {
  CLEAR_DAY = 'clearDay',
  CLEAR_NIGHT = 'clearNight',
  CLOUDY = 'cloudy',
  FOG = 'fog',
  HAIL = 'hail',
  PARTLY_CLOUDY_DAY = 'partlyCloudyDay',
  PARTLY_CLOUDY_NIGHT = 'partlyCloudyNight',
  RAIN = 'rain',
  SLEET = 'sleet',
  SNOW = 'snow',
  THUNDERSTORM = 'thunderstorm',
  WIND = 'wind',
}

export const HIGH_TEMP_WARNING_THRESHOLD = 26
export const LOW_TEMP_WARNING_THRESHOLD = 8

export interface BaseWeather {
  description: string
  icon: WeatherIcons
  precipitation?: string
  wind: string
}

export interface CurrentWeather extends BaseWeather {
  temperature: number
  alerts: string[]
}

export interface DailyWeather extends BaseWeather {
  dayOfWeek: string
  date: string
  tempMin: number
  tempMax: number
}

export interface HourlyWeather extends BaseWeather {
  time: string
  temperature: number
}

export interface Weather {
  current: CurrentWeather
  daily: DailyWeather[]
  hourly: HourlyWeather[]
  lastUpdated: Date
}

export interface WeatherResponse {
  current: {
    temp: number
    weather: WeatherData[]
    wind_speed: number
    rain?: {
      '1h': number
    }
    snow?: {
      '1h': number
    }
  }
  daily: {
    dt: number
    temp: Temperature
    wind_speed: number
    rain?: number
    snow?: number
    weather: WeatherData[]
  }[]
  hourly: {
    dt: number
    temp: number
    wind_speed: number
    rain?: {
      '1h': number
    }
    snow?: {
      '1h': number
    }
    weather: WeatherData[]
  }[]
  alerts?: {
    description: string
  }[]
}

export interface Temperature {
  min: number
  max: number
}

export interface WeatherData {
  description: string
  id: number
  main: string
  icon: string
}

export interface LocationIqResponse {
  address: {
    city: string
    district?: string
  }
}
