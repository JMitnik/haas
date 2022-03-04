/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const logger = {
  log: (...args: any[]) => console.log(...args),
  error: (...args: any[]) => console.error(...args),
}
