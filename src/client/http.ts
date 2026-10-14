import camelize from 'camelcase-keys';
import { fetch } from 'netbun';
import { Cookie } from 'bun';
import type { Logger } from 'pino';
import type { ZodType } from 'zod';

import { FicbookError } from '../util/errors';
import { generateBoundary, mapToString } from '../util/helpers';
import { generateTrace } from '../util/cryptography';
import { BASE_URL, CHROMIUM_HEADERS, MOBILE_HEADERS } from '../constants';
import type {
  GetBuilder,
  HandleBuilder,
  Headers,
  PostBuilder,
  MapBuilder,
} from '../types/http';
import type { Credentials, PartialCredentials } from '../types/ficbook';

export class Http {
  private cookies: Map<string, string> = new Map<string, string>();
  private external: Headers = {};

  private logger: Logger;
  private _proxy?: string;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  get proxy() {
    return this._proxy;
  }

  set proxy(proxy: string | undefined) {
    this._proxy = proxy;
    this.logger.info({ proxy }, 'proxy set');
  }

  get credentials(): PartialCredentials {
    return {
      rme: this.cookies.get('rme'),
      phpSessionId: this.cookies.get('PHPSESSID'),
    };
  }

  set cookie({ rme, phpSessionId }: Credentials) {
    this.cookies.set('rme', rme);
    this.cookies.set('PHPSESSID', phpSessionId);
    this.external['Cookie'] = mapToString(this.cookies);
  }

  private handle = async <T>(
    { path, response, html }: HandleBuilder,
    schema: ZodType<T>,
  ): Promise<T> => {
    if (response.status != 200) {
      this.logger.error({ path }, response.statusText);
      throw new FicbookError(response.statusText);
    }

    const cookieHeaders = response.headers.getSetCookie();
    if (cookieHeaders?.length) {
      cookieHeaders.forEach((cookieHeader) => {
        const cookie = new Cookie(cookieHeader);
        if (cookie.name) this.cookies.set(cookie.name, cookie.value);
      });
    }

    this.logger.info({ path }, response.statusText);

    return schema.parse(
      html
        ? await response.text()
        : camelize(JSON.parse(await response.text()), { deep: true }),
    );
  };

  public clear = () => {
    this.cookies.clear();
    this.external = {};
  };

  public get = async <T>(
    { path, html }: GetBuilder,
    schema: ZodType<T>,
  ): Promise<T> =>
    await this.handle(
      {
        path,
        response: await fetch(`${BASE_URL}${path}`, {
          method: 'GET',
          headers: {
            ...CHROMIUM_HEADERS,
            ...this.external,
          },
        }),
        html,
      },
      schema,
    );

  public mobile = async <T>(
    { path, body }: PostBuilder,
    schema: ZodType<T>,
  ): Promise<T> =>
    await this.handle(
      {
        path,
        response: await fetch(`${BASE_URL}/api_mobile${path}`, {
          method: 'POST',
          body,
          headers: {
            ...MOBILE_HEADERS,
            ...this.external,
            ...generateTrace(),
          },
          proxy: this.proxy,
        }),
      },
      schema,
    );

  public multipart = async <T>(
    { path, body }: MapBuilder,
    schema: ZodType<T>,
  ): Promise<T> => {
    const boundary = `----WebKitFormBoundary${generateBoundary()}`;
    const parts: Buffer[] = [];

    Object.entries(body).forEach(([key, value]) => {
      parts.push(
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`,
        ),
      );
    });
    parts.push(Buffer.from(`--${boundary}--\r\n`));

    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      body: Buffer.concat(parts),
      headers: {
        ...CHROMIUM_HEADERS,
        ...this.external,
        ...generateTrace(),
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      proxy: this.proxy,
    });

    return await this.handle({ path, response }, schema);
  };

  public urlencoded = async <T>(
    { path, body }: MapBuilder,
    schema: ZodType<T>,
  ): Promise<T> =>
    await this.handle(
      {
        path,
        response: await fetch(`${BASE_URL}${path}`, {
          method: 'POST',
          body: new URLSearchParams(body),
          headers: {
            ...CHROMIUM_HEADERS,
            ...this.external,
            ...generateTrace(),
            'Content-Type': `application/x-www-form-urlencoded;charset=UTF-8`,
          },
          proxy: this.proxy,
        }),
      },
      schema,
    );

  public healthcheck = async (): Promise<boolean> => {
    try {
      await fetch(BASE_URL, {
        method: 'GET',
        proxy: this._proxy,
      });

      return true;
    } catch {
      return false;
    }
  };
}
