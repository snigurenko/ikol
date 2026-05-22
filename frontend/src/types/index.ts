export interface Coordinates {
  lat: string
  lon: string
}

export interface DistanceResult {
  meters: number
  kilometers: number
}

export interface ApiError {
  error: string
}

export type ValidationError = string | null
