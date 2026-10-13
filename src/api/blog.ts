import { string } from 'zod';

import { matchBlogIds } from '../util/helpers';
import { type ResultResponse, ResultResponseSchema } from '../dto/common';
import type { Http } from '../client/http';

export class BlogAPI {
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  public many = async (authorId: string): Promise<string[]> =>
    matchBlogIds(
      await this.http.get<string>(
        {
          path: `/authors/${authorId}/blog`,
          html: true,
        },
        string(),
      ),
    );

  public like = async (blogId: string): Promise<boolean> =>
    (
      await this.http.urlencoded<ResultResponse>(
        { path: '/user_blog/like', body: { id: blogId, like: 'true' } },
        ResultResponseSchema,
      )
    ).result;

  public comment = async (blogId: string, text: string) =>
    (
      await this.http.urlencoded<ResultResponse>(
        { path: '/home/blog/comment_add', body: { post_id: blogId, text } },
        ResultResponseSchema,
      )
    ).result;
}
