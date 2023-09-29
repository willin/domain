# 免费域名申请/管理

## Free Domains Application / Management

[![GitHub Repo stars](https://img.shields.io/github/stars/willin/domain?style=social)](https://github.com/willin/domain) [![Fork](https://img.shields.io/github/contributors/willin/domain)](https://github.com/willin/domain/fork)

<https://domain.willin.wang/>

## 目前支持的域名 Domains Available

- js.cool
- log.lu
- sh.gg
- kaiyuan.fund
- v0.chat
- 憨憨.我爱你
- willin.vip
- willin.love

> 如果您有好的域名可以 Fork 本项目部署自己的域名申请服务，或者可以将域名转移给我用作于开源项目使用。
>
> If you have a good domain, you can fork this project to deploy your own domain application service, or you can transfer the domain to me for use in open source projects.

## 规则 Rules

### 注册条件

- 为了避免滥用，无网站内容的申请将被拒绝
- 为了避免域名冲突，请在申请前进行检查
- 您的网站至少要提供中文语言版本（推荐中英双文）
- 已经完成网站建设（提供介绍或截图）或已经发布开源项目（准备为开源项目搭建网站）
- 不可在网站中出现政治敏感及暴力、色情、链接跳转、VPN、反向代理服务等违法或敏感内容

(不定期进行域名检查，对违反以上规则、无内容和非开源相关域名进行清理)

> 特别提示：如果您的网站内容不符合中国大陆法律法规，您的域名将会被删除，且不会提供备份。

### Principe

- First of all, you need a site with content
- Check whether the subdomain is available
- Your site ~~must~~(will be nice to) have a Chinese translation edition
- Already finish web site development, or supply an opensource project you want a site for
- Illegal topics and politically sensitive contents are forbbiden (Short-link service, VPN, proxy, etc.)

(Conduct domain name inspections from time to time, and clean up domain names that violate the above rules, have no content, and are non-open source related domain names)

> Special reminder: If the content of your website does not comply with Chinese laws and regulations, your domain name will be deleted and no backup will be provided.

## 参考资料 Refs

- API: https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records

## 赞助 Sponsor

如果您对本项目感兴趣，可以通过以下方式支持我：

- 关注我的 Github 账号：[@willin](https://github.com/willin) [![github](https://img.shields.io/github/followers/willin.svg?style=social&label=Followers)](https://github.com/willin)
- 参与 [爱发电](https://afdian.net/@willin) 计划
- 支付宝或微信[扫码打赏](https://user-images.githubusercontent.com/1890238/89126156-0f3eeb80-d516-11ea-9046-5a3a5d59b86b.png)

Donation ways:

- Github: <https://github.com/sponsors/willin>
- Paypal: <https://paypal.me/willinwang>
- Alipay or Wechat Pay: [QRCode](https://user-images.githubusercontent.com/1890238/89126156-0f3eeb80-d516-11ea-9046-5a3a5d59b86b.png)

## 许可证 License

Apache-2.0

---

## 开发 Development

```bash
# init db
npx wrangler d1 migrations apply RECORDS --local

# optional import data
npx wrangler d1 execute RECORDS --file /PATH/data.sql --local
```
