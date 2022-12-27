import { Container } from "typedi";
import { IRepository } from '@core/data/repository.interface';
import { SystemConfig } from '@core/configuration';

export function Repository<T>(id: string = null): ParameterDecorator {
  return (object: any, propertyName: string, index?: number): any => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: () => Container.get<IRepository<T>>(id ?? SystemConfig.getRepositoryServiceId),
    });
  };
}
export { IRepository };