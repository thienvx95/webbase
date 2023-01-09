import { ICacheBase } from '../cacheBase.interface';
import { RedisClientType, createClient } from 'redis';
import { SystemConfig } from '@core/configuration';
import { Logging } from '@core/log';
import { SiteSettings } from '@infrastructures/siteSetting';
import { CacheTime } from '@core/constants';

export class RedisCache implements ICacheBase {
  private cache: RedisClientType;
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
    this.cache = createClient({
      url: `redis://${this.config.Username}:${this.config.Password}@${this.config.Url}:${this.config.Port}`,
    });
    this.cache.on('connect', () => {
      this.log.info(`Redis connection established`);
    });

    this.cache.on('error', (error) => {
      this.log.error(`Redis error, service degraded: ${error}`);
    });

    this.cache.on('reconnecting', () => this.log.info(`Redis reconnecting'`));

    await this.cache.connect();

    this.cache.flushDb();
  }

  async getAsync<T>(key: string): Promise<T> 
  async getAsync<T>(key: string, fetcher?: () => Promise<T>): Promise<T> 
  async getAsync<T>(key: string, fetcher?: () => Promise<T>, cacheTime?: number): Promise<T>{
    cacheTime = cacheTime ?? (this.siteSettings.get('Cache_Time') ?? CacheTime ) as number;
    const result = await this.cache.get(key);
    if(result){
        return JSON.parse(result);
    }
    if(fetcher){
        const fetchData = await fetcher()
        this.cache.setEx(`${this.config.Prefix}${key}`, cacheTime, JSON.stringify(fetchData));
        return fetchData;
    }
    return null;
  }

  async removeAsync(key: string): Promise<void> {
   await this.cache.del(key);
  }
  async removeByPrefix(prefix: string): Promise<void> {
    for await (const key of this.cache.scanIterator({
        TYPE: 'string', // `SCAN` only
        MATCH: `*${prefix}*`,
        COUNT: 100
      })) {
        // use the key!
        await  this.removeAsync(key);
      }
  }
  async clear(): Promise<void> {
    this.cache.flushAll();
  }
}
