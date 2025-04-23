import { z } from 'zod';

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  tags: z.array(z.string()),
  reactions: z.number()
});

export const PostsResponseSchema = z.object({
  posts: z.array(PostSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number()
});

export type Post = z.infer<typeof PostSchema>;
export type PostsResponse = z.infer<typeof PostsResponseSchema>; 