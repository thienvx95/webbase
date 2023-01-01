import mongoose, { Mongoose } from 'mongoose';
import * as bluebird from 'bluebird';

import { SystemConfig } from '@core/configuration';
import { Logging } from '@core/log';

export class MongoDatabase {
  private _log = Logging.getInstance('Database');
  private _mongooseDB: Mongoose;
  private static _instance: MongoDatabase;
  public MongoVersion: string;

  public static getInstance(): MongoDatabase {
    if (!MongoDatabase._instance) {
      MongoDatabase._instance = new MongoDatabase();
    }

    return MongoDatabase._instance;
  }

  private async getDatabase (): Promise<Mongoose>{
    const dataSettings = SystemConfig.Configs.DataSettings;
    const options: mongoose.ConnectOptions = {
        autoIndex: true,
        autoCreate: true,
        maxPoolSize: 10,
        dbName: dataSettings.DbName,
    };

    (<Mongoose>mongoose).Promise = bluebird;

    try{
      mongoose.set('strictQuery', false);
      await mongoose.connect(dataSettings.ConnectionString, options);
      this._log.info('-------------------------------------------------------');
      this._log.info(`Connected to mongo server`);
      this._mongooseDB = mongoose;
      return this._mongooseDB;
    }catch (err) {
      this._log.error('Failed to connect to MongoDB', err)
      throw Error(`Failed to connect to MongoDB ${err}`)
      
    }
  }

  private getMongoVersion = async (): Promise<void> => {
    const admin = this._mongooseDB.connection.db.admin();
    const info = await admin.serverInfo();
    this.MongoVersion =  info?.version;
  }

  // Initialize your database pool
  public get Mongoose(): Mongoose {
    return this._mongooseDB;
  }

  public async init(): Promise<void> {
    await this.getDatabase();
    await this.getMongoVersion();
  }
}