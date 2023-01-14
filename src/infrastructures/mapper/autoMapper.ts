import {
    createMapper,
    Mapper,
    createMap,
    ModelIdentifier,
    Mapping,
    MappingConfiguration,
  } from '@automapper/core';
  import { classes } from '@automapper/classes';
  import { isEmpty } from 'lodash';
import { injectable } from 'inversify';
  
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

  @injectable()
  export class AutoMapper implements IAutoMapper {
    private static instance: AutoMapper;
    public _mapper: Mapper;
    constructor() {
      this._mapper = createMapper({
        strategyInitializer: classes(),
      });
    }
  
    public createMap<T, K>(
      source: ModelIdentifier<T>,
      destination: ModelIdentifier<K>,
      ...mappingConfigFns: (MappingConfiguration<T, K> | undefined)[]
    ): Mapping<T, K> {
      return createMap(this._mapper, source, destination,...mappingConfigFns);
    }
  
    public Map<T, K>(
      sourceObject: T,
      source: ModelIdentifier<T>,
      destination: ModelIdentifier<K>,
      
    ): K {
      if(isEmpty(sourceObject)) return null;
      return this._mapper.map(sourceObject, source, destination);
    }
  
    public MapArray<T, K>(
      sourceObject: T[],
      source: ModelIdentifier<T>,
      destination: ModelIdentifier<K>,
    ): K[] {
      if(isEmpty(sourceObject)) return [];
      return this._mapper.mapArray(sourceObject, source, destination);
   }
  
    public static getInstance = (): AutoMapper => {
      if (!AutoMapper.instance) {
        AutoMapper.instance = new AutoMapper();
      }
      return AutoMapper.instance;
    };
  }
  
  export default AutoMapper;
  