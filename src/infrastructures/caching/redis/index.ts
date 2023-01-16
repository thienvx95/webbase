import { ICacheBase } from '../cacheBase.interface';
import Redis from 'ioredis';
import { SystemConfig } from '@core/configuration';
import { Logging } from '@core/log';
import { SiteSettings } from '@business/common/service/siteSetting';
import { CacheTime } from '@core/constants';
import { injectable } from 'inversify';

@injectable()
export class RedisCache implements ICacheBase {
  private cache: Redis;
  private readonly log = Logging.getInstance('RedisCache');
  private readonly config = SystemConfig.Configs.ReditSetting;
  private readonly siteSettings = SiteSettings.getInstance();
  private static _instance: RedisCache;

  public static getInstance(): RedisCache {
    if (!RedisCache._instance) {
      RedisCache._instance = new RedisCache();
    }

    return RedisCache._instance;
  }

  public async init(): Promise<void> {
    this.cache = new Redis({
      port: this.config.Port, // Redis port
      host: this.config.Url, // Redis host
      username: this.config.Username, // needs Redis >= 6
      password: this.config.Password,
      db: this.config.Db, // Defaults to 0
    });
    this.cache.on('connect', () => {
      this.log.info(`Redis connection established`);
    });

    this.cache.on('error', (error) => {
      this.log.error(`Redis error, service degraded: ${error}`);
    });  

    this.cache.flushdb();
  }

  async getAsync<T>(key: string): Promise<T>;
  async getAsync<T>(key: string, fetcher?: () => Promise<T>): Promise<T>;
  async getAsync<T>(
    key: string,
    fetcher?: () => Promise<T>,
    cacheTime?: number,
  ): Promise<T> {
    cacheTime =
      cacheTime ??
      ((this.siteSettings.get('Cache_Time') ?? CacheTime) as number);
    const cacheKey = `${this.config.Prefix}_${key}`;
    const result = await this.cache.get(cacheKey);
    if (result) {
      return JSON.parse(result);
    }
    if (fetcher) {
      const fetchData = await fetcher();
      this.cache.setex(cacheKey, cacheTime, JSON.stringify(fetchData));
      return fetchData;
    }
    return null;
  }

  async removeAsync(key: string): Promise<void> {
    const cacheKey = `${this.config.Prefix}_${key}`;
    await this.cache.del(cacheKey);
  }
  async removeByPrefix(prefix: string): Promise<void> {
    for await (const key of this.cache.scanStream({
      type: 'string', // `SCAN` only
      match: `*${prefix}*`,
      count: 100,
    })) {
      // use the key!
      await this.removeAsync(key);
    }
  }
  async clear(): Promise<void> {
    this.cache.flushall();
  }
  disconnect(): void {
    if (this.cache) {
      this.cache.disconnect(false);
    }
  }
}
