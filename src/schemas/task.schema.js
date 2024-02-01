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
    .datetime({
      message: 'Not date time type',
    }),
  dueDate: z
    .string({
      required_error: 'No date provided',
    })
    .datetime({
      message: 'Not date time type',
    }),
});
