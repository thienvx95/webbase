import { ModelIdentifier } from "@automapper/core"

export interface IAutoMapper{
    Map<T, K>(
      sourceObject: T,
      source: any,
      destination: ModelIdentifier<K>,
    ): K
    MapArray<T, K>(
      sourceObject: T[],
      source: any,
      destination: ModelIdentifier<K>,
    ): K[]
  }