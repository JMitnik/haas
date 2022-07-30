/* eslint-disable no-console */
export type Environment = 'test' | 'development' | 'production';

export enum LifeCycleType {
  START,
  END,
  GENERIC,
}

const MapLifeCycle = {
  [LifeCycleType.START]: '🏳️',
  [LifeCycleType.END]: '🏁',
  [LifeCycleType.GENERIC]: '🟢',
}

export class Logger {
  environment: Environment;
  verbose: boolean;

  constructor(environment: Environment, verbose: boolean = false) {
    this.environment = environment;
    this.verbose = verbose;
  }

  /**
   * Log Lifecycle Events
   * @param val
   * @returns
   */
  public logLifeCycle(val: string, type: LifeCycleType = LifeCycleType.GENERIC) {
    if (this.environment === 'test' && !this.verbose) return;

    console.log(`⚙️    ${MapLifeCycle[type]}  App Lifecycle: ${val}`);
  }

  public logMetric(val: string) {
    console.log(`⏱️\t${val}`);

  }

  public debug(val: string) {
    console.debug(val);
  }

  public log(val: string) {
    console.log(val);
  }

  public error(val: string, error: unknown) {
    // TODO: Send to Sentry
    if (error instanceof Error) {
      console.error(`⚠️\tError: ${val} \n\n\n Message: ${error.message}`);
    } else {
      console.log(val, error);
    }
  }
}
