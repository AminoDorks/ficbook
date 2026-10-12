import z from 'zod';

import { UserSchema } from '../entities/user';
import { ThreadSchema } from '../entities/thread';

export const GetTopSchema = z.object({
  result: z.boolean(),
  data: z.array(UserSchema),
});

export const CreateThreadSchema = z.object({
  result: z.boolean(),
  data: ThreadSchema,
});

export type GetTop = z.infer<typeof GetTopSchema>;
export type CreateThread = z.infer<typeof CreateThreadSchema>;
