import camelize from 'camelcase-keys';
import { fetch } from 'netbun';
import type { Logger } from 'pino';
import type { ZodType } from 'zod';

import { FicbookError } from '../util/errors';
import { extractCookie, generateBoundary } from '../util/helpers';
import { BASE_URL, CHROMIUM_HEADERS, MOBILE_HEADERS } from '../constants';
import type { Headers } from '../types/http';
import type { MobileBuilder, MultipartBuilder } from '../types/http';

export class Http {
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

  private handle = async <T>(
    path: string,
    { status, statusText, text, headers }: Response,
    schema: ZodType<T>,
  ): Promise<T> => {
    if (status != 200) {
      this.logger.error({ path }, statusText);
      throw new FicbookError(statusText);
    }

    const cookieHeaders = headers.getSetCookie();

    if (cookieHeaders) this.external['Cookie'] = extractCookie(cookieHeaders);

    return schema.parse(camelize(JSON.parse(await text()), { deep: true }));
  };

  public mobile = async <T>(
    { path, body }: MobileBuilder,
    schema: ZodType<T>,
  ) => {
    const response = await fetch(`${BASE_URL}/api_mobile${path}`, {
      method: 'POST',
      body,
      headers: {
        ...MOBILE_HEADERS,
        ...this.external,
      },
      proxy: this.proxy,
    });

    return await this.handle(path, response, schema);
  };

  public multipart = async <T>(
    { path, body }: MultipartBuilder,
    schema: ZodType<T>,
  ) => {
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
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      proxy: this.proxy,
    });

    return await this.handle(path, response, schema);
  };

  public urlencoded = async <T>(path: string, schema: ZodType) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        ...CHROMIUM_HEADERS,
        ...this.external,
        'Content-Type': `application/x-www-form-urlencoded;charset=UTF-8`,
      },
      proxy: this.proxy,
    });

    return await this.handle(path, response, schema);
  };
}
