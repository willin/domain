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
  SSO_ID: z.string().min(1),
  SSO_SECRET: z.string().min(1),
  CF_API_TOKEN: z.string(),
  CF_ACCOUNT_ID: z.string(),
  CF_SITE_TAGS: z
    .string()
    .transform((v) => z.string().array().parse(JSON.parse(v))),
  FREE_DOMAINS: z
    .string()
    .transform((v) =>
      z.tuple([z.string(), z.string()]).array().parse(JSON.parse(v))
    )
});

export type Env = z.infer<typeof EnvSchema>;
