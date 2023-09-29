import type { I18nDict } from 'remix-i18n';

export const dict: I18nDict = {
  common: {
    total: '总计域名记录',
    login: '申请 / 管理',
    logout: '退出登录',
    available: '可注册域名后缀',
    views: '访问',
    rank: '24 小时访问排行',
    rank_notice: '只有 CDN Proxy 域名参与排行',
    forbidden: '禁止访问',
    go_back: '返回',
    mine: '我的域名记录(可创建：{{available}})',
    create: '创建',
    edit: '编辑',
    delete: '删除',
    limit_info: '域名数量限制策略',
    follow: '⭐️ 去关注',
    donate: '⚡ 去充电',
    user: '登录用户',
    follower: 'Github 关注粉丝',
    vip: '打赏月捐 VIP'
  },
  domain: {
    type: '类型',
    name: '域名',
    content: '记录',
    check: '校验',
    save: '保存',
    purpose: '域名用途',
    purpose_tip: '描述域名使用场景（必须包含中文字符）',
    pending: '等待审核',
    username: '用户名',
    approve: '通过',
    decline: '拒绝',
    confirm_delete: '确认要删除该域名吗？',
    punycode_notice: '注意： 添加域名绑定时使用 Punycode 域名',
    agree: '我已阅读并承诺遵守',
    rules: '《域名注册规则》'
  }
};
