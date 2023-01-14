import {
    JsonController,
    Get,
  } from 'routing-controllers';
  import { ResponseSchema } from 'routing-controllers-openapi';
  import { inject, injectable } from 'inversify';
import { COMMON_TYPES } from '@infrastructures/modules/common';
import { ICacheBase } from '@infrastructures/caching/cacheBase.interface';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { CountryDto } from '../model/geographic/country.dto';
import * as countries from '../../../data/countries.json';

  @injectable()
  @JsonController('/geographic')
  export class GeographicController {
    constructor(
      @inject(COMMON_TYPES.MemoryCache) private memoryCache: ICacheBase,
    ) {}
  
    @Get("/countries")
    @ResponseSchema(CountryDto, { isArray: true })
    async getCountries(): Promise<CountryDto[]> {
      return await this.memoryCache.getAsync(CacheKey.GeographicCountries, async () => {
        return countries as Array<CountryDto>
      });
    }
  }
