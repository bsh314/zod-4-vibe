import { z } from 'zod';

// Define a schema for reactions
export const ReactionsSchema = z.object({
  likes: z.number().optional(),
  dislikes: z.number().optional()
});

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  tags: z.array(z.string()),
  reactions: ReactionsSchema
});

export const PostsResponseSchema = z.object({
  posts: z.array(PostSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number()
});

export type Reactions = z.infer<typeof ReactionsSchema>;
export type Post = z.infer<typeof PostSchema>;
export type PostsResponse = z.infer<typeof PostsResponseSchema>; 