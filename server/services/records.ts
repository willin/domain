import { z } from 'zod';
import { PendingStatus } from '~/config';
import {
  CloudflareAnalyticsProvider,
  type ICloudflareAnalyticsProvider
} from '../provider/cloudflare-analytics';
import {
  CloudflareDNSProvider,
  type ICloudflareDNSProvider
} from '../provider/cloudflare-dns';

const RecordSchema = z.object({
  // user schema
  username: z.string(),
  pending: z.enum(Object.values(PendingStatus)).or(z.number()),
  purpose: z.string().optional().default(''),
  // record schema
  id: z.string().optional().or(z.null()),
  name: z.string(),
  content: z.string(),
  type: z.string(),
  // comment: z.string().optional().default(''),
  zone_id: z.string(),
  zone_name: z.string().optional().default(''),
  ttl: z.number().optional().default(1),
  proxiable: z
    .number()
    .default(true)
    .transform((v) => !!v),
  priority: z.number().optional(),
  created_at: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : null))
});

export interface IRecordService {
  getTopSites(): Promise<[string, number][]>;
  countSites(): Promise<[string, number][]>;
  getUserRecords({ username: string }): Promise<(typeof RecordSchema)[]>;
  getPendingRecords(): Promise<(typeof RecordSchema)[]>;
  addPendingRecord(params: {
    zone_id: string;
    name: string;
    content: string;
    type: string;
    proxiable?: boolean;
    username?: string;
    priority?: number;
    purpose?: string;
  }): Promise<boolean>;
  approvePendingRecord(params: {
    zone_id: string;
    name: string;
  }): Promise<boolean>;
  declinePendingRecord(params: {
    zone_id: string;
    name: string;
  }): Promise<boolean>;
  editRecord(params: {
    id: string;
    zone_id: string;
    name: string;
    content: string;
    type: string;
    proxiable?: boolean;
    priority?: number;
    // username?: string;
  }): Promise<boolean>;
  deleteRecord(params: { zone_id: string; id: string }): Promise<boolean>;
  checkRecord(params: { zone_id: string; name: string }): Promise<boolean>;
}

export class RecordService implements IRecordService {
  #db: D1Database;
  #kv: KVNamespace;
  #config: [string, string][];
  #getZoneName(params: { zone_id: string }): string {
    return this.#config.find(([, zid]) => zid === params.zone_id)?.[0];
  }
  #dns: ICloudflareDNSProvider;
  #analytics: ICloudflareAnalyticsProvider;

  constructor(env: RemixServer.Env, d1: D1Database, kv: KVNamespace) {
    this.#db = d1;
    this.#kv = kv;
    this.#config = env.FREE_DOMAINS;
    this.#dns = new CloudflareDNSProvider(env);
    this.#analytics = new CloudflareAnalyticsProvider(env);
  }

  public async getTopSites() {
    const key = '$$TopSites';
    let json: [string, number][] = await this.#kv.get(key, 'json');
    if (!json) {
      json = await this.#analytics.getTopSites();
      await this.#kv.put(key, JSON.stringify(json), {
        expirationTtl: 7200
      });
    }
    return json;
  }

  public async countSites() {
    const key = '$$TotalCounts';
    let json: [string, number][] = await this.#kv.get(key, 'json');
    if (!json) {
      const stmt = this.#db.prepare(
        'SELECT zone_id, COUNT(1) as count FROM records GROUP BY zone_id ORDER BY count DESC'
      );
      const result = await stmt.raw();
      const total = result.reduce((acc, [, count]) => acc + count, 0);
      result.unshift(['total', total]);
      json = result;
      await this.#kv.put(key, JSON.stringify(json), {
        expirationTtl: 7200
      });
    }
    return json;
  }

  public async getUserRecords(params: { username: string }) {
    const { username } = params;

    const stmt = this.#db
      .prepare(
        'SELECT * FROM records WHERE username = ?1 ORDER BY created_at DESC'
      )
      .bind(username);
    const { results } = await stmt.all();
    return results.map((item) =>
      RecordSchema.parse({
        ...item,
        zone_name: this.#getZoneName({ zone_id: item.zone_id })
      })
    );
  }

  public async getPendingRecords() {
    const stmt = this.#db
      .prepare(
        'SELECT * FROM records WHERE pending = ?1 ORDER BY created_at DESC'
      )
      .bind(PendingStatus.PENDING);
    const { results } = await stmt.all();
    return results.map((item) =>
      RecordSchema.parse({
        ...item,
        zone_name: this.#getZoneName({ zone_id: item.zone_id })
      })
    );
  }

  public async addPendingRecord(
    params: Parameters<IRecordService['addPendingRecord']>[0]
  ) {
    const {
      zone_id,
      name,
      content,
      type,
      username = '',
      proxiable = false,
      priority = 10,
      purpose = ''
    } = params;
    const { success } = await this.#db
      .prepare(
        'INSERT INTO records (username, pending, purpose, name, content, type, zone_id, ttl, proxiable, priority) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)'
      )
      .bind(
        username,
        PendingStatus.PENDING,
        purpose,
        name,
        content,
        type,
        zone_id,
        ttl,
        proxiable,
        priority
      )
      .run();
    return success;
  }

  public async approvePendingRecord(
    params: Parameters<IRecordService['approvePendingRecord']>[0]
  ) {
    const { name, zone_id } = params;
    const stmt = this.#db
      .prepare('SELECT * FROM records WHERE name = ?1 AND zone_id = ?2 LIMIT 1')
      .bind(name, zone_id);

    const result = await stmt.first();
    const item = RecordSchema.parse(result);
    const data = await this.#dns.editDomain(item);
    if (!data) {
      return false;
    }
    const { success } = await this.#db
      .prepare(
        'UPDATE records SET raw = ?1, pending = ?2 WHERE name = ?3 AND zone_id = ?4'
      )
      .bind(JSON.stringify(data), PendingStatus.APPROVED, name, zone_id)
      .run();
    return success;
  }

  public async declinePendingRecord(
    params: Parameters<IRecordService['declinePendingRecord']>[0]
  ) {
    const { name, zone_id } = params;
    const { success } = await this.#db
      .prepare(
        'UPDATE records SET pending = ?1 WHERE name = ?2 AND zone_id = ?3'
      )
      .bind(PendingStatus.DECLINED, name, zone_id)
      .run();
    return success;
  }

  public async editRecord(params: Parameters<IRecordService['editRecord']>[0]) {
    const {
      id,
      name,
      content,
      type,
      proxiable = false,
      priority = 10
    } = params;
    const data = await this.#dns.editDomain(params);
    if (!data) {
      return false;
    }
    const { success } = await this.#db
      .prepare(
        'UPDATE records SET name = ?2, content = ?3, type = ?4, proxiable = ?5, priority = ?6, raw = ?7 WHERE id = ?1'
      )
      .bind(id, name, content, type, proxiable, priority, JSON.stringify(data))
      .run();
    return success;
  }

  public deleteRecord(params: Parameters<IRecordService['deleteRecord']>[0]) {
    return this.#dns.deleteDomain(params);
  }

  public checkRecord(params: Parameters<IRecordService['checkRecord']>[0]) {
    return this.#dns.checkDomain({
      ...params,
      domain: this.#getZoneName(params)
    });
  }
}
