import { environment } from '../../../environments/environment';

export default class Debug {
  public static log(...args: unknown[]): void {
    if (environment.production === false) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  }
  public static error(...args: unknown[]): void {
    if (environment.production === false) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  }
}
