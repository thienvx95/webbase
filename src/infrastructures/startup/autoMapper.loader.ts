import { ILoader, ISettings } from '@microframework';
import AutoMapper from '@infrastructures/mapper/autoMapper';
import { MapDtoToEntity, MapEntityToDto } from '@infrastructures/mapper/mappingEntity';

export const AutoMapperLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const autoMapper = AutoMapper.getInstance();
    MapDtoToEntity(autoMapper);
    MapEntityToDto(autoMapper);
  }
};
