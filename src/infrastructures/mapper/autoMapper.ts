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
import { IAutoMapper } from '@business/core/interface';
import { PaginationModel } from 'mongoose-paginate-ts';
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
    return createMap(this._mapper, source, destination, ...mappingConfigFns);
  }

  public Map<T, K>(
    sourceObject: T,
    source: ModelIdentifier<T>,
    destination: ModelIdentifier<K>,
  ): K {
    if (isEmpty(sourceObject)) return null;
    return this._mapper.map(sourceObject, source, destination);
  }

  public MapArray<T, K>(
    sourceObject: T[],
    source: ModelIdentifier<T>,
    destination: ModelIdentifier<K>,
  ): K[] {
    if (isEmpty(sourceObject)) return [];
    return this._mapper.mapArray(sourceObject, source, destination);
  }

  public MapPaging<T, K>(
    paging: PaginationModel<T>,
    source: any,
    destination: ModelIdentifier<K>,
  ): PaginationModel<K> {
    const mappingModel = this.MapArray<T, K>(paging.docs, source, destination);
    const pagingViewModel = this.PagingToViewModel<T, K>(mappingModel, paging);
    return pagingViewModel;
  }

  public static getInstance = (): AutoMapper => {
    if (!AutoMapper.instance) {
      AutoMapper.instance = new AutoMapper();
    }
    return AutoMapper.instance;
  };

  private PagingToViewModel<T, K>(
    mappingModel: K[],
    paging: PaginationModel<T>,
  ): PaginationModel<K> {
    const pagingViewModel = new PaginationModel<K>();
    pagingViewModel.docs = mappingModel;
    pagingViewModel.hasNextPage = paging.hasNextPage;
    pagingViewModel.hasPrevPage = paging.hasPrevPage;
    pagingViewModel.limit = paging.limit;
    pagingViewModel.nextPage = paging.nextPage;
    pagingViewModel.page = paging.page;
    pagingViewModel.pagingCounter = paging.pagingCounter;
    pagingViewModel.prevPage = paging.prevPage;
    pagingViewModel.totalDocs = paging.totalDocs;
    pagingViewModel.totalPages = paging.totalPages;
    return pagingViewModel;
  }
}

export default AutoMapper;
