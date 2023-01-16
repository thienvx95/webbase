import { FilterQuery, QueryOptions, ProjectionType, UpdateQuery } from 'mongoose';
import { ReturnModelType, DocumentType, getModelForClass } from '@typegoose/typegoose';
import { AnyParamConstructor, BeAnObject } from '@typegoose/typegoose/lib/types';
import { HttpStatus, HttpStatusError } from '@core/exception/httpStatusError';
import { IRepository } from '../repository.interface';
import { ErrorEnum } from '@core/enums/error.enum';
import { PaginateOptions, PaginateResult } from '@business/common/model';
import { BaseEntity } from '@entities/base.entity';
import { BuildQuery } from '@business/core/utils/buildQuery';
import { Logging } from '@core/log';

export interface IPaginateModel<T> {
  paginate(options: PaginateOptions): PaginateResult<DocumentType<T>>;
}

export class MongoRepository<T = BaseEntity> implements IRepository<T> {
  private readonly _model: IPaginateModel<T> & ReturnModelType<AnyParamConstructor<T>>;
  constructor(_class: { new(): T ;} ) {
    this._model = getModelForClass(_class) as IPaginateModel<T> & ReturnModelType<AnyParamConstructor<T>>;
  }
  /**
   * Handle Error Mongoose
   * @param error - Error mongoose
   */
  private handleError = (error: any): any => {
    Logging.getInstance('Repository').error(`${JSON.stringify(error)}`, 'HandleError')
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
      return await this._model.create({ ...entity });
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

    /**
   * Insert entity if not exist
   * @param entities - array model
   */
  async insertIfNotExist(filter: FilterQuery<DocumentType<T>>, entity: T): Promise<boolean> {
    try {
      const existEntity = await this._model.updateOne(filter, { $setOnInsert: { ...entity } } , { upsert: true});
      return existEntity.upsertedCount > 0;
    } catch (e) {
      return this.handleError(e);
    }
  }

  /**
   * Update an entity
   * @param id - id update
   * @param entity - entity
   * @returns
   */
  async updateOne(id: string, entity: T): Promise<boolean> {
    try {
      const result = await this._model.updateOne({ _id: id }, { $set: { ...entity } } , { upsert: false}).exec();
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
   * Bulk Write entities
   * @param writes - array model
   */
  async bulkWrite(writes: any[]): Promise<boolean> {
    try {
      const result = await this._model.bulkWrite(writes);
      return result.modifiedCount > 0;
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
  ): Promise<PaginateResult<DocumentType<T>>> 
  {
      return await this._model.paginate(BuildQuery.convertToQuery(option));
  }
}
