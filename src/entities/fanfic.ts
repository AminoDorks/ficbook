import z from 'zod';

export const FanficSchema = z.object({
  id: z.number(),
  slug: z.string(),
  authorId: z.number(),
  size: z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
  }),
  rating: z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string(),
  }),
  title: z.string(),
  description: z.string(),
  authorComment: z.string(),
  status: z.number(),
  partCnt: z.number(),
  reviewCnt: z.number(),
  dateAdded: z.number(),
  lastUpdated: z.number(),
  likeCnt: z.number(),
  isPremium: z.boolean(),
  bannedInRussia: z.boolean(),
  followCnt: z.number(),
  fandoms: z.array(
    z.object({
      id: z.number(),
      slug: z.string(),
      title: z.string(),
    }),
  ),
  pairings: z.array(z.string()),
  authorUsername: z.string(),
  authorAvatarPath: z.string(),
});

export type Fanfic = z.infer<typeof FanficSchema>;
