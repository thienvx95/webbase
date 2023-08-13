import { ModelIdentifier } from '@automapper/core';
import { PaginationModel } from 'mongoose-paginate-ts';

export interface IAutoMapper {
  /**
   * Map Model to ViewModel
   * @param sourceObject
   * @param source
   * @param destination
   */
  Map<T, K>(sourceObject: T, source: any, destination: ModelIdentifier<K>): K;

  /**
   * Map Model Array to ViewModel Array
   * @param sourceObject
   * @param source
   * @param destination
   */
  MapArray<T, K>(
    sourceObject: T[],
    source: any,
    destination: ModelIdentifier<K>,
  ): K[];

  /**
   * Map Pagingation Model to Pagination ViewModel
   * @param sourceObject
   * @param source
   * @param destination
   */
  MapPaging<T, K>(
    sourceObject: PaginationModel<T>,
    source: any,
    destination: ModelIdentifier<K>,
  ): PaginationModel<K>;
}
