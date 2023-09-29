import type { I18nDict } from 'remix-i18n';

export const dict: I18nDict = {
  common: {
    total: 'Total Domains Registered',
    login: 'Apply / Manage',
    logout: 'Logout',
    available: 'Available Domains',
    views: 'visits',
    rank: '24h Top Visits',
    rank_notice: 'Only CDN Proxy domains listed',
    forbidden: 'Forbidden',
    go_back: 'Go Back',
    mine: 'My Domain Records ({{available}} remains)',
    create: 'Create',
    edit: 'Edit',
    delete: 'Delete',
    limit_info: 'Domain Count Limit Policy',
    follow: '⭐️ Go & Follow',
    donate: '⚡ Sponsor Willin',
    user: 'User',
    follower: 'Github Follower',
    vip: 'Sponsor / VIP'
  },
  domain: {
    type: 'Type',
    name: 'Name',
    content: 'Content',
    check: 'Check',
    save: 'Save',
    purpose: 'Purpose',
    purpose_tip: 'Describe domain purpose (Must contain Chinese characters)',
    pending: 'Pending',
    username: 'Username',
    approve: 'Approve',
    decline: 'Decline',
    confirm_delete: 'Are you sure to delete this domain?',
    punycode_notice:
      'Note: Use Punycode domain name when adding domain binding',
    agree: 'I have read and agree to the',
    rules: ' Domain Registration Rules'
  }
};
