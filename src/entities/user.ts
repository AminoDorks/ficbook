import z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  slug: z.string(),
  avatarPath: z.string().optional(),
  isPremium: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;
