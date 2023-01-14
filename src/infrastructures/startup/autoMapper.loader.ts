import { ILoader, ISettings } from '@microframework';
import AutoMapper from '@infrastructures/mapper/autoMapper';
import { MapEntityToDto } from '@infrastructures/mapper/mappingEntity';

export const AutoMapperLoader: ILoader = async (
  settings: ISettings | undefined,
) => {
  if (settings) {
    const autoMapper = AutoMapper.getInstance();
    MapEntityToDto(autoMapper);
  }
};
