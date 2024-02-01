import { z } from 'zod';

export const getDeleteTaskSchema = z.object({
  id: z.number({
    required_error: 'No number provided',
  }),
});

export const createUpdateTaskSchema = z.object({
  text: z.string({
    required_error: 'No text provided',
  }),
  postDate: z
    .string({
      required_error: 'No date provided',
    })
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/),
  dueDate: z
    .string({
      required_error: 'No date provided',
    })
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/),
});
