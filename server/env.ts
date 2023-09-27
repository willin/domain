import { z } from 'zod';

export let EnvSchema = z.object({
  // BASE_URL: z.string().min(1).url(),
  CF_PAGES: z
    .literal('1')
    .optional()
    .transform(Boolean)
    .transform((isCFPages) => {
      if (isCFPages) return 'production';
      return 'development';
    }),
  COOKIE_SESSION_SECRET: z.string().min(1).optional().default('s3cret'),
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),
  GITHUB_CALLBACK_URL: z
    .string()
    .url()
    .optional()
    .default('https://domain.willin.wang/auth/github/callback')
});

export type Env = z.infer<typeof EnvSchema>;
