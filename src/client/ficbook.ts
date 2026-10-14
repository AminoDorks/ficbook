import type { Logger } from 'pino';

import { Http } from './http';
import { createLogger } from '../util/logger';
import { AuthAPI } from '../api/auth';
import { FanficAPI } from '../api/fanfic';
import { UserAPI } from '../api/user';
import { BlogAPI } from '../api/blog';
import type { Config } from '../types/ficbook';

export class Ficbook {
  private logger: Logger;
  private http: Http;

  private authApi?: AuthAPI;
  private fanficApi?: FanficAPI;
  private userApi?: UserAPI;
  private blogApi?: BlogAPI;

  constructor({ enableLogging }: Config) {
    this.logger = createLogger(!!enableLogging);
    this.http = new Http(this.logger);
  }

  get auth() {
    if (!this.authApi) this.authApi = new AuthAPI(this.http);

    return this.authApi;
  }

  get fanfic() {
    if (!this.fanficApi) this.fanficApi = new FanficAPI(this.http);

    return this.fanficApi;
  }

  get user() {
    if (!this.userApi) this.userApi = new UserAPI(this.http);

    return this.userApi;
  }

  get blog() {
    if (!this.blogApi) this.blogApi = new BlogAPI(this.http);

    return this.blogApi;
  }

  set proxy(proxy: string) {
    this.http.proxy = proxy;
  }

  public healthcheck = async (): Promise<boolean> =>
    await this.http.healthcheck();
}
