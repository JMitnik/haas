/**
 * Gets random integer from interval (between `min` and `max`).
 */
export function getRandomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
