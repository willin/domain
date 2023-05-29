export const BaseURL = process.env.BASE_URL || 'https://domain.willin.wang';
export const AdminId = process.env.ADMIN_ID || 'willin';

const FreeDomainsConfig: [string, string][] = process.env.FREE_DOMAINS
  ? JSON.parse(process.env.FREE_DOMAINS)
  : [
      //
      ['js.cool', process.env.CF_ZONE_JS_COOL || ''],
      ['sh.gg', process.env.CF_ZONE_SH_GG || ''],
      ['log.lu', process.env.CF_ZONE_LOG_LU || ''],
      ['kaiyuan.fund', process.env.CF_ZONE_KAIYUAN_FUND || ''],
      ['v0.chat', process.env.CF_ZONE_V0_CHAT || ''],
      ['憨憨.我爱你', process.env.CF_ZONE_HANHAN_WOAINI || '']
    ];

export const FreeDomainsMapping = Object.fromEntries(FreeDomainsConfig);
export const FreeDomains = FreeDomainsConfig.map(([domain]) => domain);

export const CFAccountId = process.env.CF_ACCOUNT_ID || '';
export const CFApiToken = process.env.CF_API_TOKEN || '';
export const CFNamespaceId = process.env.CF_NAMESPACE_ID || '';
export const CFSiteTags = (process.env.CF_SITE_TAGS || '').split(',').map((s) => s.trim());

export const DNSType = ['A', 'AAAA', 'CNAME', 'NS', 'TXT'];

export const BlockedList = [
  'about',
  'account',
  'ad',
  'ads',
  'admin',
  'admins',
  'api',
  'app',
  'blog',
  'bbs',
  'cdn',
  'ddns',
  'dev',
  'developer',
  'dns',
  'doc',
  'docs',
  'document',
  'documentation',
  'domain',
  'donate',
  'edu',
  'feed',
  'free',
  'ftp',
  'fund',
  'git',
  'github',
  'gov',
  'i',
  'imap',
  'm',
  'member',
  'mil',
  'mirror',
  'mobile',
  'my',
  'net',
  'ns',
  'ns1',
  'ns2',
  'news',
  'now',
  'online',
  'org',
  'open',
  'pop3',
  'pub',
  'rss',
  'shop',
  'site',
  'smtp',
  'store',
  'sub',
  'subscribe',
  'support',
  'sync',
  'system',
  'tag',
  'team',
  'tech',
  'test',
  'tip',
  'tool',
  'url',
  'user',
  'vip',
  'vpn',
  'vps',
  'w',
  'wap',
  'web',
  'ww',
  'www'
];
