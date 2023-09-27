import {
  CloudflareDNSProvider,
  type ICloudflareDNSProvider
} from 'server/provider/cloudflare-dns';
import { z } from 'zod';
import { PendingStatus } from '~/config';

const RecordSchema = z.object({
  // user schema
  username: z.string(),
  pending: z.number(),
  pursose: z.string().optional().default(''),
  // record schema
  name: z.string(),
  content: z.string(),
  type: z.string(),
  // comment: z.string().optional().default(''),
  zone_id: z.string(),
  // zone_name: z.string(),
  ttl: z.number().optional().default(1),
  proxied: z.boolean().default(true),
  priority: z.number().optional(),
  created_at: z.date().optional()
});

export interface IRecordService {
  getUserRecords({ username: string }): Promise<(typeof RecordSchema)[]>;
  addPendingRecord(params: {
    zone_id: string;
    name: string;
    content: string;
    type: string;
    proxied?: boolean;
    username?: string;
    priority?: number;
    purpose?: string;
  }): Promise<boolean>;
  approvePendingRecord(params: {
    zone_id: string;
    name: string;
  }): Promise<boolean>;
  rejectPendingRecord(params: {
    zone_id: string;
    name: string;
  }): Promise<boolean>;
  editRecord();
  deleteRecord();
  checkRecord();
}

export class RecordService implements IRecordService {
  #db: D1Database;
  #dns: ICloudflareDNSProvider;

  constructor(d1: D1Database, env: RemixServer.Env) {
    this.#db = d1;
    this.#dns = new CloudflareDNSProvider(env);
  }

  public async getUserRecords(params: { username: string }) {
    const { username } = params;

    const stmt = this.#db
      .prepare(
        'SELECT * FROM records WHERE username=?1 ORDER BY created_at DESC'
      )
      .bind(username);
    const result = await stmt.all();
    return RecordSchema.array().parse(result);
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
      proxied = false,
      priority = 10,
      purpose = ''
    } = params;
    const { success } = await this.#db
      .prepare(
        'INSERT INTO records (username, pending, purpose, name, content, type, zone_id, ttl, proxied, priority) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)'
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
        proxied,
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

  public async rejectPendingRecord(
    params: Parameters<IRecordService['rejectPendingRecord']>[0]
  ) {
    const { name, zone_id } = params;
    const { success } = await this.#db
      .prepare(
        'UPDATE records SET pending = ?1 WHERE name = ?2 AND zone_id = ?3'
      )
      .bind(PendingStatus.REJECT, name, zone_id)
      .run();
    return success;
  }

  public editRecord() {}

  public deleteRecord() {}

  public checkRecord() {}
}
