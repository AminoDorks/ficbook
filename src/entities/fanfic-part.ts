import z from 'zod';

export const FanficPartSchema = z.object({
  id: z.number(),
  partTitle: z.string(),
  commentsCount: z.number(),
  isPublic: z.boolean(),
});

export type FanficPart = z.infer<typeof FanficPartSchema>;
