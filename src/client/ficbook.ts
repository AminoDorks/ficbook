import type { Logger } from 'pino';

import { Http } from './http';
import { createLogger } from '../util/logger';
import { AuthAPI } from '../api/auth';
import { FanficAPI } from '../api/fanfic';
import { UserAPI } from '../api/user';
import type { Config } from '../types/ficbook';

export class Ficbook {
  private logger: Logger;
  private http: Http;

  private authApi?: AuthAPI;
  private fanficApi?: FanficAPI;
  private userApi?: UserAPI;

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
}
