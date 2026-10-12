import z from 'zod';

import { UserSchema } from './user';

export const ThreadSchema = z.object({
  id: z.string(),
  userIds: z.array(z.number()),
  isPrivate: z.boolean(),
  dateCreate: z.number(),
  users: z.array(UserSchema),
});

export type Thread = z.infer<typeof ThreadSchema>;
