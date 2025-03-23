import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  blogId: z.string(),
});

export type signUpType = z.infer<typeof signUpSchema>;
export type loginType = z.infer<typeof loginSchema>;
export type createBlogType = z.infer<typeof createBlogSchema>;
export type updateBlogType = z.infer<typeof updateBlogSchema>;
