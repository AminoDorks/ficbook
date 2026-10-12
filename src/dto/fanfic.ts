import z from 'zod';

import { FanficSchema } from '../entities/fanfic';
import { FanficPartSchema } from '../entities/fanfic-part';
import { CommentSchema } from '../entities/comment';

export const GetFanficSchema = z.object({
  result: z.boolean(),
  data: z.object({
    ...FanficSchema.shape,
  }),
});

export const GetFanficPartsSchema = z.object({
  result: z.boolean(),
  data: z.object({
    parts: z.array(FanficPartSchema),
  }),
});

export const GetPartTextSchema = z.object({
  result: z.boolean(),
  data: z.string(),
});

export const GetPartCommentsSchema = z.object({
  result: z.boolean(),
  data: z.object({
    comments: z.array(CommentSchema),
  }),
});

export const CreateFanficSchema = z.object({
  result: z.boolean(),
  data: z.object({
    redirect: z.string(),
  }),
});

export type GetFanfic = z.infer<typeof GetFanficSchema>;
export type GetFanficParts = z.infer<typeof GetFanficPartsSchema>;
export type GetPartText = z.infer<typeof GetPartTextSchema>;
export type GetPartComments = z.infer<typeof GetPartCommentsSchema>;
export type CreateFanfic = z.infer<typeof CreateFanficSchema>;
