export const BaseURL = process.env.BASE_URL || 'https://domain.willin.wang';

export const FreeDomains = process.env.FREE_DOMAINS
  ? process.env.FREE_DOMAINS.split(',').map((s) => s.trim())
  : [
      //
      'js.cool',
      'sh.gg',
      'log.lu',
      'kaiyuan.fund',
      'v0.chat',
      '憨憨.我爱你'
    ];

export const CFAccountId = process.env.CF_ACCOUNT_ID || '';
export const CFApiToken = process.env.CF_API_TOKEN || '';
export const CFSiteTags = (process.env.CF_SITE_TAGS || '').split(',').map((s) => s.trim());
