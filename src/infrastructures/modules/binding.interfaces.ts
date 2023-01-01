export enum LifeTime{
    Singleton,
    Transient,
    Scoped
}
export interface IBinding {
    class: any,
    symbol: any,
    lifeTime: LifeTime,
}