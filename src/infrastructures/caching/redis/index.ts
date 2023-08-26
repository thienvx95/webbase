import { ICacheBase } from '../cacheBase.interface';
import Redis from 'ioredis';
import { SystemConfig } from '@core/configuration';
import { Logging } from '@core/log';
import { SiteSettings } from '@business/system/service/siteSetting.service';
import { CacheTime } from '@core/constants';
import { injectable } from 'inversify';
import { Application } from '@infrastructures/applicationInfo';
import { CacheProvider } from '@core/enums/cacheProvider.enum';

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
    try {
      this.cache = new Redis({
        lazyConnect: true,
        port: this.config.Port, // Redis port
        host: this.config.Url, // Redis host
        username: this.config.Username, // needs Redis >= 6
        password: this.config.Password,
        db: this.config.Db, // Defaults to 0
        autoResubscribe: false,
        maxRetriesPerRequest: 0,
      });

      // this.cache.on('error', (err: any): void => {
      //   if (err.code === 'ECONNREFUSED') {
      //     this.log.warn(`Could not connect to Redis: ${err.message}.`);
      //   } else if (err.name === 'MaxRetriesPerRequestError') {
      //     this.log.error(
      //       `Critical Redis error: ${err.message}. Shutting down.`,
      //     );
      //     process.exit(1);
      //   } else {
      //     this.log.error(`Redis encountered an error: ${err.message}.`);
      //   }
      // });

      this.cache.flushdb();
      Application.getInstance().setCacheProvider(
        CacheProvider.Redis,
        `Redis connection established`,
      );
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        this.log.warn(`Could not connect to Redis: ${err.message}.`);
      } else if (err.name === 'MaxRetriesPerRequestError') {
        this.log.error(`Critical Redis error: ${err.message}. Shutting down.`);
      } else {
        this.log.error(`Redis encountered an error: ${err.message}.`);
      }
      Application.getInstance().setCacheProvider(
        CacheProvider.MemoryCache,
        `Redis encountered an error: ${err.message}.`,
      );
    }
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
