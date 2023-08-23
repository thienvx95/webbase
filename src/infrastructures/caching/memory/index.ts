import * as NodeCache from 'node-cache';
import { ICacheBase } from '@business/core/interface';
import { injectable } from 'inversify';
import { SystemConfig } from '@core/configuration';
import { CacheTime } from '@core/constants';
import { SiteSettings } from '@business/system/service/siteSetting.service';

@injectable()
export class MemoryCache implements ICacheBase {
  private cache: NodeCache;
  private readonly config = SystemConfig.Configs.MemoryCacheSetting;
  private readonly siteSettings = SiteSettings.getInstance();
  private static _instance: MemoryCache;

  public static getInstance(): MemoryCache {
    if (!MemoryCache._instance) {
      MemoryCache._instance = new MemoryCache();
    }

    return MemoryCache._instance;
  }

  public async init(): Promise<void> {
    this.cache = new NodeCache();
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
    const result = await this.cache.get<T>(cacheKey);
    if (result || result != undefined) {
      return result;
    }
    if (fetcher) {
      const fetchData = await fetcher();
      this.cache.set<T>(cacheKey, fetchData, cacheTime);
      return fetchData;
    }
    return null;
  }

  async removeAsync(key: string): Promise<void> {
    const cacheKey = `${this.config.Prefix}_${key}`;
    await this.cache.del(cacheKey);
  }
  async removeByPrefix(prefix: string): Promise<void> {
    await this.deleteWithWildcard(prefix);
  }
  async clear(): Promise<void> {
    this.cache.flushAll();
  }
  disconnect(): void {
    if (this.cache) {
      this.cache.close();
    }
  }

  async deleteWithWildcard(key: string): Promise<void> {
    const keys = this.cache.keys();
    for await (const k of keys) {
      if (k.startsWith(key)) {
        await this.removeAsync(k);
      }
    }
  }
}
