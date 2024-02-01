import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string({
    required_error: 'Not title provided',
  }),
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

export const updateTaskSchema = z.object({
  title: z.string({
    required_error: 'Not title provided',
  }),
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
