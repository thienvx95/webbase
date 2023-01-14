import { Container } from 'inversify';
import { IRepository } from '@core/data/repository.interface';
import { MongoRepository } from '@core/data/mongoDb/mongo.repository';
import { DbProvider } from '@core/enums/dbProvider.enum';
import {
  Setting,
  User,
  UserToken,
  Language,
  Role,
  Menu,
  DomainHost,
  FileUpload,
  Permission
} from 'entities';
import { SystemConfig } from '@core/configuration';
import { IBinding, LifeTime } from './binding.interfaces';

export const REPOSITORY_TYPES = {
  UserRepository: Symbol.for('UserRepository'),
  UserTokenRepository: Symbol.for('UserTokenRepository'),
  LanguageRepository: Symbol.for('LanguageRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  SettingRepository: Symbol.for('SettingRepository'),
  MenuRepository: Symbol.for('MenuRepository'),
  DomainHostRepository: Symbol.for('DomainHostRepository'),
  FileUploadRepository: Symbol.for('FileUploadRepository'),
  PermissionRepository: Symbol.for('PermissionRepository'),
};

export const bindingRepositories: Array<IBinding> = [
  {
    class: User,
    symbol: REPOSITORY_TYPES.UserRepository,
    lifeTime: LifeTime.Scoped,
  },
  {
    class: UserToken,
    symbol: REPOSITORY_TYPES.UserTokenRepository,
    lifeTime: LifeTime.Scoped,
  },
  {
    class: Setting,
    symbol: REPOSITORY_TYPES.SettingRepository,
    lifeTime: LifeTime.Scoped,
  },
  {
    class: Language,
    symbol: REPOSITORY_TYPES.LanguageRepository,
    lifeTime: LifeTime.Scoped,
  },
  {
    class: Role,
    symbol: REPOSITORY_TYPES.RoleRepository,
    lifeTime: LifeTime.Scoped,
  },
  {
    class: Menu,
    symbol: REPOSITORY_TYPES.MenuRepository,
    lifeTime: LifeTime.Scoped,
  },
  {
    class: DomainHost,
    symbol: REPOSITORY_TYPES.DomainHostRepository,
    lifeTime: LifeTime.Scoped,
  },
  {
    class: FileUpload,
    symbol: REPOSITORY_TYPES.FileUploadRepository,
    lifeTime: LifeTime.Scoped,
  },
  {
    class: Permission,
    symbol: REPOSITORY_TYPES.PermissionRepository,
    lifeTime: LifeTime.Scoped,
  },
];

export function repositories(container: Container): void {
  bindingRepositories.forEach(x => {
    const model = x.class;
    const regisster = container
    .bind<IRepository<typeof model>>(x.symbol)
    .toDynamicValue(() => {
        if(SystemConfig.DbProvider == DbProvider.MongoDB){
            return new MongoRepository<typeof model>(model);
        }
        return null;
    })
    if(x.lifeTime == LifeTime.Scoped){
        regisster.inRequestScope()
    }
    if(x.lifeTime == LifeTime.Singleton){
        regisster.inSingletonScope()
    }
    if(x.lifeTime == LifeTime.Transient){
        regisster.inTransientScope()
    }
  });
}

export { IRepository };
