import z from 'zod';

export const ResultResponseSchema = z.object({
  result: z.boolean(),
});

export type ResultResponse = z.infer<typeof ResultResponseSchema>;
