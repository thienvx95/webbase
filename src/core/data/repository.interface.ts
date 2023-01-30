import {
  FilterQuery,
  QueryOptions,
  ProjectionType,
  UpdateQuery,
  Types,
} from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { PaginateOptions, PaginateResult } from '@business/common/model';

export { Types };
export type IRepository<T> = IWrite<T> & IRead<T>;
export interface IWrite<T> {
  insertOne(entity: T): Promise<T>;
  insertMany(entities: T[]): Promise<T[]>;
  insertIfNotExist(
    filter: FilterQuery<DocumentType<T>>,
    entity: T,
  ): Promise<boolean>;
  update(
    filter: FilterQuery<DocumentType<T>>,
    update: UpdateQuery<DocumentType<T>>,
  ): Promise<boolean>;
  updateOne(id: string, entity: T): Promise<boolean>;
  updateMany(entities: T[]): Promise<boolean>;
  bulkWrite(writes: Array<any>): Promise<boolean>;
  deleteOne(entity: T): Promise<boolean>;
  deleteById(_id: string): Promise<boolean>;
  deleteMany(entities: T[]): Promise<boolean>;
  delete(filter: FilterQuery<DocumentType<T>>): Promise<boolean>;
}
export interface IRead<T> {
  find(
    filter: FilterQuery<DocumentType<T>>,
    projection?: ProjectionType<DocumentType<T>> | null,
    options?: QueryOptions,
  ): Promise<DocumentType<T>[]>;
  findById(
    _id: string,
    projection?: ProjectionType<DocumentType<T>> | null,
    options?: QueryOptions,
  ): Promise<DocumentType<T>>;
  findOne(
    filter: FilterQuery<DocumentType<T>>,
    projection?: ProjectionType<DocumentType<T>> | null,
    options?: QueryOptions,
  ): Promise<DocumentType<T>>;
  findPaging(option: PaginateOptions): Promise<PaginateResult<DocumentType<T>>>;
}
