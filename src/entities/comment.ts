import z from 'zod';

export const CommentSchema = z.object({
  id: z.number(),
  text: z.string(),
  dateCreate: z.number(),
  likeCnt: z.number(),
  user: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export type Comment = z.infer<typeof CommentSchema>;
