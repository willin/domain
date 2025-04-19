export enum PendingStatus {
  APPROVED = 0,
  PENDING = 1,
  DECLINED = 2
}

export const MAX_LIMIT_USER = 0 as const;
export const MAX_LIMIT_FOLLOWER = 5 as const;
export const MAX_LIMIT_VIP = 20 as const;
export const MAX_LIMIT_ADMIN = 100 as const;

export const AdminUsers = ['willin'] as const;

export const DNSType = ['CNAME'] as const; //['A', 'AAAA', 'CNAME', 'NS', 'TXT'] as const;

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
  'cn',
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
  'mail',
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
] as const;

export const BlockedUsers: string[] = [
  // Blocked users
] as const;
