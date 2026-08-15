export const KILOMETERS_PER_MILE = 1.609344

export function kilometersToMiles(kilometers: number): number {
  return kilometers / KILOMETERS_PER_MILE
}

export function milesToKilometers(miles: number): number {
  return miles * KILOMETERS_PER_MILE
}
