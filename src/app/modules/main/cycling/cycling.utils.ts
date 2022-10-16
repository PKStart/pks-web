import {
  StravaActivityResponse,
  StravaBikeData,
  StravaBikeDataResponse,
  StravaRideStats,
  StravaRideStatsResponse,
} from './cycling.types'
import { startOfWeek } from 'date-fns'

export function metersToKms(meters: number): number {
  return Math.round(meters / 100) / 10
}

export function secondsToHours(seconds: number): number {
  return Math.round((seconds / 60 / 60) * 10) / 10
}

export function convertRideStats(res: StravaRideStatsResponse): StravaRideStats {
  return {
    achievementCount: res.achievement_count,
    activityCount: res.count,
    distance: metersToKms(res.distance),
    elevationGain: Math.floor(res.elevation_gain),
    movingTime: secondsToHours(res.moving_time),
  }
}

export function convertBikeData(res: StravaBikeDataResponse): StravaBikeData {
  return {
    distance: metersToKms(res.distance),
    name: res.name,
    nickname: res.nickname,
    id: res.id,
  }
}

export function getPrimaryBikeData(bikes: StravaBikeDataResponse[]): StravaBikeData {
  const primaryBike = bikes.find(({ primary }) => primary)
  if (!primaryBike) {
    throw new Error('No primary bike found on Strava')
  }
  return convertBikeData(primaryBike)
}

export function getMonthAndWeekStats(allActivities: StravaActivityResponse[]): {
  thisWeek: StravaRideStats
  thisMonth: StravaRideStats
} {
  const rides = allActivities.filter(({ sport_type }) =>
    ['Ride', 'MountainBikeRide', 'VirtualRide', 'EBikeRide'].includes(sport_type)
  )
  const thisMonthBase: StravaRideStats = {
    activityCount: rides.length,
    movingTime: 0,
    elevationGain: 0,
    distance: 0,
  }
  const thisMonth = rides.reduce((acc, { total_elevation_gain, moving_time, distance }) => {
    return {
      ...acc,
      movingTime: acc.movingTime + moving_time,
      distance: acc.distance + distance,
      elevationGain: acc.elevationGain + Math.floor(total_elevation_gain),
    }
  }, thisMonthBase)

  thisMonth.distance = metersToKms(thisMonth.distance)
  thisMonth.movingTime = secondsToHours(thisMonth.movingTime)

  const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 })
  const ridesThisWeek = rides.filter(({ start_date }) => new Date(start_date) > startOfThisWeek)
  const thisWeekBase: StravaRideStats = {
    activityCount: ridesThisWeek.length,
    movingTime: 0,
    elevationGain: 0,
    distance: 0,
  }
  const thisWeek = ridesThisWeek.reduce((acc, { total_elevation_gain, moving_time, distance }) => {
    return {
      ...acc,
      movingTime: acc.movingTime + moving_time,
      distance: acc.distance + distance,
      elevationGain: acc.elevationGain + Math.floor(total_elevation_gain),
    }
  }, thisWeekBase)

  thisWeek.distance = metersToKms(thisWeek.distance)
  thisWeek.movingTime = secondsToHours(thisWeek.movingTime)
  return {
    thisMonth,
    thisWeek,
  }
}
