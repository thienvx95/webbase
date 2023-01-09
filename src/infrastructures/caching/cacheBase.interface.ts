export interface ICacheBase
{
    getAsync<T>(key: string): Promise<T>;
    getAsync<T>(key: string, fetcher: () => Promise<T>): Promise<T>;
    getAsync<T>(key: string, fetcher: () => Promise<T>, cacheTime: number): Promise<T>;
    removeAsync(key: string): Promise<void>;
    removeByPrefix(prefix: string): Promise<void>;
    clear(): Promise<void>;
}