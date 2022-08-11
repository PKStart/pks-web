import { format } from 'date-fns'
import { capitalize } from '../../../utils/strings'
import {
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
  Weather,
  WeatherIcons,
  WeatherResponse,
} from './weather.types'

export function transformWeather(res: WeatherResponse): Weather {
  const current: CurrentWeather = {
    temperature: Math.round(res.current.temp),
    description: capitalize(res.current.weather[0].description),
    icon: getIconForWeatherId(res.current.weather[0].icon),
    precipitation: getPrecipitationLh(res.current),
    wind: getWindScale(res.current.wind_speed),
    alerts: res.alerts?.map(a => a.description) ?? [],
  }
  const daily: DailyWeather[] = res.daily.map(day => ({
    dayOfWeek: format(new Date(day.dt * 1000), 'dddd'),
    date: format(new Date(day.dt * 1000), 'MMMM D.'),
    wind: getWindScale(day.wind_speed),
    description: capitalize(day.weather[0].description),
    icon: getIconForWeatherId(day.weather[0].icon),
    precipitation: getPrecipitation(day),
    tempMin: Math.round(day.temp.min),
    tempMax: Math.round(day.temp.max),
  }))
  const hourly: HourlyWeather[] = res.hourly
    .map(hour => ({
      time: format(new Date(hour.dt * 1000), 'ha'),
      description: capitalize(hour.weather[0].description),
      wind: getWindScale(hour.wind_speed),
      precipitation: getPrecipitationLh(hour),
      temperature: Math.round(hour.temp),
      icon: getIconForWeatherId(hour.weather[0].icon),
    }))
    .slice(1, 25)
  return {
    current,
    daily,
    hourly,
    lastUpdated: new Date(),
  }
}

function getPrecipitationLh<T extends { rain?: { '1h': number }; snow?: { '1h': number } }>(
  obj: T
): string | undefined {
  if (obj.rain)
    return `${obj.rain['1h'] !== 0 && obj.rain['1h'] < 1 ? '<1' : Math.round(obj.rain['1h'])}mm`
  if (obj.snow)
    return `${obj.snow['1h'] !== 0 && obj.snow['1h'] < 1 ? '<1' : Math.round(obj.snow['1h'])}mm`
  return undefined
}

function getPrecipitation<T extends { rain?: number; snow?: number }>(obj: T): string | undefined {
  if (obj.rain) return `${obj.rain !== 0 && obj.rain < 1 ? '<1' : Math.round(obj.rain)}mm`
  if (obj.snow) return `${obj.snow !== 0 && obj.snow < 1 ? '<1' : Math.round(obj.snow)}mm`
  return undefined
}

export function getIconForWeatherId(id: string): WeatherIcons {
  switch (id) {
    case '01d':
      return WeatherIcons.CLEAR_DAY
    case '01n':
      return WeatherIcons.CLEAR_NIGHT
    case '02d':
    case '03d':
      return WeatherIcons.PARTLY_CLOUDY_DAY
    case '02n':
    case '03n':
      return WeatherIcons.PARTLY_CLOUDY_NIGHT
    case '04d':
    case '04n':
      return WeatherIcons.CLOUDY
    case '09d':
    case '09n':
      return WeatherIcons.HAIL
    case '10d':
    case '10n':
      return WeatherIcons.RAIN
    case '11d':
    case '11n':
      return WeatherIcons.THUNDERSTORM
    case '13d':
    case '13n':
      return WeatherIcons.SNOW
    case '50d':
    case '50n':
      return WeatherIcons.FOG
    default:
      return WeatherIcons.CLEAR_DAY
  }
}

export function getWindScale(wSpeed: number | undefined): string {
  let wScale = 'No wind'
  if (!wSpeed || wSpeed === 0) return wScale
  if (wSpeed > 1 && wSpeed <= 4) {
    wScale = 'Light breeze'
  } else if (wSpeed > 4 && wSpeed <= 9) {
    wScale = 'Light wind'
  } else if (wSpeed > 9 && wSpeed <= 13) {
    wScale = 'Moderate wind'
  } else if (wSpeed > 13 && wSpeed <= 19) {
    wScale = 'Strong wind'
  } else if (wSpeed > 19 && wSpeed <= 24) {
    wScale = 'Stormy wind'
  } else if (wSpeed > 24) {
    wScale = 'Crazy wind'
  }
  return wScale
}
