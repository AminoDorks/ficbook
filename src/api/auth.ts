import { type ResultResponse, ResultResponseSchema } from '../dto/common';
import type { Http } from '../client/http';
import type { PartialCredentials, RegisterBuilder } from '../types/ficbook';

export class AuthAPI {
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  public login = async (rme: string, phpSessionId: string) =>
    (this.http.cookie = { rme, phpSessionId });

  public register = async (
    builder: RegisterBuilder,
  ): Promise<PartialCredentials> => {
    await this.http.mobile<ResultResponse>(
      {
        path: `/register`,
        body: JSON.stringify(builder),
      },
      ResultResponseSchema,
    );

    return this.http.credentials;
  };

  public verifyCode = async (code: string): Promise<boolean> =>
    (
      await this.http.mobile<ResultResponse>(
        {
          path: `/registration/verify_code`,
          body: JSON.stringify({ code }),
        },
        ResultResponseSchema,
      )
    ).result;
}
