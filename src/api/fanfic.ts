import { string } from 'zod';

import { generateDate, matchSlugIds } from '../util/helpers';
import { ResultResponseSchema, type ResultResponse } from '../dto/common';
import {
  type GetFanfic,
  type GetFanficParts,
  GetFanficPartsSchema,
  type GetPartText,
  GetPartTextSchema,
  GetFanficSchema,
  type GetPartComments,
  GetPartCommentsSchema,
  type CreateFanfic,
  CreateFanficSchema,
} from '../dto/fanfic';
import type { Http } from '../client/http';
import type { Fanfic } from '../entities/fanfic';
import type { FanficPart } from '../entities/fanfic-part';
import type { Comment } from '../entities/comment';
import type { AddPartBuilder, CreateFanficBuilder } from '../types/ficbook';

export class FanficAPI {
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  public get = async (slugId: string): Promise<Fanfic> =>
    (
      await this.http.mobile<GetFanfic>(
        {
          path: '/fanfic',
          body: JSON.stringify({ fanfic_slug: slugId }),
        },
        GetFanficSchema,
      )
    ).data;

  public like = async (slugId: string): Promise<boolean> =>
    (
      await this.http.mobile<ResultResponse>(
        {
          path: '/fanfic/like',
          body: JSON.stringify({ fanfic_slug: slugId }),
        },
        ResultResponseSchema,
      )
    ).result;

  public follow = async (fanficId: number): Promise<boolean> =>
    (
      await this.http.mobile<ResultResponse>(
        {
          path: '/fanfic/follow',
          body: JSON.stringify({ fanfic_id: fanficId }),
        },
        ResultResponseSchema,
      )
    ).result;

  public fanfiction = async (page?: number): Promise<string[]> =>
    matchSlugIds(
      await this.http.get<string>(
        { path: `/fanfiction${page ? `?p=${page}` : ''}`, html: true },
        string(),
      ),
    );

  public parts = async (slugId: string): Promise<FanficPart[]> =>
    (
      await this.http.mobile<GetFanficParts>(
        {
          path: '/fanfic_parts',
          body: JSON.stringify({ fanfic_slug: slugId }),
        },
        GetFanficPartsSchema,
      )
    ).data.parts;

  public text = async (partId: number): Promise<string> =>
    (
      await this.http.mobile<GetPartText>(
        {
          path: '/fanfic_part_text',
          body: JSON.stringify({ part_id: partId }),
        },
        GetPartTextSchema,
      )
    ).data;

  public comments = async (
    partId: number,
    page: number = 1,
    perPage: number = 20,
  ): Promise<Comment[]> =>
    (
      await this.http.mobile<GetPartComments>(
        {
          path: '/fanfic/parts/comments/get',
          body: JSON.stringify({ part_id: partId, page, per_page: perPage }),
        },
        GetPartCommentsSchema,
      )
    ).data.comments;

  public comment = async (partId: number, comment: string): Promise<boolean> =>
    (
      await this.http.mobile<ResultResponse>(
        {
          path: '/fanfic/parts/comments/add',
          body: JSON.stringify({ part_id: partId, comment, reactions: [] }),
        },
        ResultResponseSchema,
      )
    ).result;

  public create = async (builder: CreateFanficBuilder): Promise<number> =>
    Number(
      (
        await this.http.multipart<CreateFanfic>(
          {
            path: `/home/addfic_save`,
            body: {
              title: builder.title,
              competition_id: '34',
              fic_type: 'author_fic',
              real_author: '',
              original_link: '',
              fandom_type: '',
              'fandom_ids[]': builder.fandomId,
              pairing: builder.pairing || '',
              rating: builder.rating || '5',
              direction: '1',
              description: builder.description,
              author_comment: builder.authorComment || '',
              dedication: '',
              size: builder.size || '2',
              continue_enable: '1',
              continue_required_votes: '0',
              publication: '1',
              comments_setting: '3',
              enable_marks: '1',
            },
          },
          CreateFanficSchema,
        )
      ).data.redirect.match(/\d+/)![0]!,
    );

  public addPart = async (builder: AddPartBuilder): Promise<boolean> =>
    (
      await this.http.multipart<ResultResponse>(
        {
          path: '/home/fanfics/partadd_save',
          body: {
            fanfic_id: builder.fanficId,
            title: builder.title,
            content: builder.content,
            comment_before: '',
            comment_after: '',
            param: '2',
            auto_pub: '1',
            part_auto_pub_date: generateDate(),
            continue_required_votes: '0',
            'dates[]': '2026-10-11',
          },
        },
        ResultResponseSchema,
      )
    ).result;
}
