import { FilterQuery, QueryOptions, ProjectionType, UpdateQuery } from 'mongoose';
import { ReturnModelType, DocumentType, getModelWithString } from '@typegoose/typegoose';
import { AnyParamConstructor, BeAnObject } from '@typegoose/typegoose/lib/types';
import { HttpStatus, HttpStatusError } from '@core/exception/httpStatusError';
import { IRepository } from '../repository.interface';
import { ErrorEnum } from '@core/enums/error.enum';
import { PaginateOptions, PaginateResult } from '@business/common/model';
import { BaseEntity } from '@entities/base.entity';
import { Service } from 'typedi';
import { BuildQuery } from '@business/common/utils/buildQuery';

@Service({ id: 'mongoRepository.factory' })
export class MongoRepository<T> implements IRepository<T> {
  private readonly _model: ReturnModelType<AnyParamConstructor<T>>;
  private _class:T;
  constructor() {
    this._model = getModelWithString((typeof this._class));
  }
  /**
   * Handle Error Mongoose
   * @param error - Error mongoose
   */
  private handleError = (error: any) => {
    if (error.code && error.code === 11000) {
      throw new HttpStatusError(HttpStatus.BadRequest, ErrorEnum.Duplicate_Record);
    }
    throw error;
  };

  /**
   * Insert an entity
   * @param entity - model
   * @returns entity
   */
  async insertOne(entity: T): Promise<DocumentType<T>> {
    try {
      return await this._model.create(entity);
    } catch (e) {
      return this.handleError(e);
    }
  }

  /**
   * Insert many entities
   * @param entities - array model
   */
  async insertMany(entities: T[]): Promise<DocumentType<T>[]> {
    try {
      return await this._model.insertMany(entities);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async findOrInsertOne(filter: FilterQuery<DocumentType<T>>, entity: T): Promise<T> {
    try {
      const existEntity = await this._model.findOne(filter);
      if(existEntity){
        return existEntity;
      }
      return await this._model.create(entity);
    } catch (e) {
      return this.handleError(e);
    }
  }

  /**
   * Update an entity
   * @param entity - entity
   * @returns
   */
  async updateOne(entity: T): Promise<boolean> {
    try {
      const result = await this._model.updateOne(entity).exec();
      return result.matchedCount > 0;
    } catch (e) {
      this.handleError(e);
      return false;
    }
  }

  /**
   * Update an entity
   * @param entity - entity
   * @returns
   */
   async update(filter: FilterQuery<DocumentType<T, BeAnObject>>, update: UpdateQuery<DocumentType<T, BeAnObject>>): Promise<boolean> {
    try {
      const result = await this._model.updateOne(filter, update).exec();
      return result.matchedCount > 0;
    } catch (e) {
      this.handleError(e);
      return false;
    }
  }
  
  /**
   * Update many entities
   * @param entities - array model
   */
  async updateMany(entities: T[]): Promise<boolean> {
    try {
      const result = await this._model.updateMany(entities).exec();
      return result.matchedCount > 0;
    } catch (e) {
      this.handleError(e);
      return false;
    }
  }

  /**
   * Delete an entity
   * @param entity - entity
   * @returns
   */
  async deleteOne(entity: T): Promise<boolean> {
    try {
      const result = await this._model.deleteOne(entity).exec();
      return result.deletedCount > 0;
    } catch (e) {
      this.handleError(e);
      return false;
    }
  }

  /**
   * Delete many entities
   * @param entities - array model
   */
  async deleteMany(entities: T[]): Promise<boolean> {
    try {
      const result = await this._model.deleteMany(entities).exec();
      return result.deletedCount > 0;
    } catch (e) {
      this.handleError(e);
      return false;
    }
  }

  
  /**
   * Delete many entities
   * @param entities - array model
   */
   async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this._model.deleteOne({ _id: id}).exec();
      return result.deletedCount > 0;
    } catch (e) {
      this.handleError(e);
      return false;
    }
  }

  /**
   * Find array entities
   * @param filter - query filter entity
   * @param projection - projection entity
   * @param options - optional
   */
  async find(filter: FilterQuery<DocumentType<T>>, projection?: ProjectionType<DocumentType<T>>, options?: QueryOptions): Promise<DocumentType<T>[]> {
    return await this._model.find(filter, projection, options);
  }

  /**
   * Find an entity
   * @param filter - query filter entity
   * @param projection - projection entity
   * @param options - optional
   */
  async findOne(filter: FilterQuery<DocumentType<T>>, projection?: ProjectionType<DocumentType<T>> | null, options?: QueryOptions): Promise<DocumentType<T>> {
    return await this._model.findOne(filter, projection, options);
  }

  /**
   * Find one by id
   * @param _id - id of entity
   * @param projection - projection entity
   * @param options - optional
   */
  async findById(_id: string, projection?: ProjectionType<DocumentType<T>> | null, options?: QueryOptions): Promise<DocumentType<T>> {
    return await this._model.findById(_id, projection, options);
  }

  public async findPaging(
    option: PaginateOptions,
  ): Promise<PaginateResult<DocumentType<T>>> {
    return await BaseEntity.paginate(BuildQuery.convertToQuery(option));
  }
}
