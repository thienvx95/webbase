import { Container } from "typedi";
import { IRepository } from '@core/data/repository.interface';
import { AutoMapper, IAutoMapper } from '@infrastructures/mapper/autoMapper';
export function AutoMapperDecorator(): ParameterDecorator {
  return (object: any, propertyName: string, index?: number): any => {
    Container.registerHandler({
        object,
        propertyName,
        index,
        value: () => AutoMapper.getInstance(),
      });
  };
}
export { IRepository, IAutoMapper };