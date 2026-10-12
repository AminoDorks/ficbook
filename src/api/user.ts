import { string } from 'zod';

import { TopType } from '../types/ficbook';
import { matchToken } from '../util/helpers';
import { type ResultResponse, ResultResponseSchema } from '../dto/common';
import {
  type CreateThread,
  CreateThreadSchema,
  type GetTop,
  GetTopSchema,
} from '../dto/user';
import type { Http } from '../client/http';
import type { User } from '../entities/user';
import type { Thread } from '../entities/thread';

export class UserAPI {
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  public top = async (type: TopType = TopType.Weekly): Promise<User[]> =>
    (
      await this.http.mobile<GetTop>(
        {
          path: '/authors_top',
          body: JSON.stringify({ type }),
        },
        GetTopSchema,
      )
    ).data;

  public edit = async (about: string): Promise<boolean> =>
    (
      await this.http.multipart<ResultResponse>(
        {
          path: '/home/personal_info',
          body: {
            token: matchToken(
              await this.http.get<string>(
                {
                  path: '/home/personal_info',
                  html: true,
                },
                string(),
              ),
            ),
            about_myself: about,
            contact_info: '',
            support_me: '',
          },
        },
        ResultResponseSchema,
      )
    ).result;

  public favourite = async (authorId: string): Promise<boolean> =>
    (
      await this.http.urlencoded<ResultResponse>(
        {
          path: '/user/favourite/add',
          body: {
            author_id: authorId,
          },
        },
        ResultResponseSchema,
      )
    ).result;

  public createThread = async (userId: string): Promise<Thread> =>
    (
      await this.http.urlencoded<CreateThread>(
        {
          path: '/home/messaging/getorcreateprivatethread',
          body: {
            user_id: userId,
          },
        },
        CreateThreadSchema,
      )
    ).data;

  public text = async (threadId: string, text: string): Promise<boolean> =>
    (
      await this.http.urlencoded<ResultResponse>(
        {
          path: '/home/messaging/send',
          body: {
            thread_id: threadId,
            text,
          },
        },
        ResultResponseSchema,
      )
    ).result;
}
