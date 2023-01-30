import { JsonController, Get } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { inject, injectable } from 'inversify';
import { ICacheBase } from '@infrastructures/caching/cacheBase.interface';
import { CacheKey } from '@core/enums/cacheKey.enum';
import { CountryDto } from '../model/geographic/country.dto';
import * as countries from '../../../data/countries.json';
import { COMMON_TYPES } from '@infrastructures/modules';
import {
  BaseController,
  ResponseResult,
  RoutingAPI,
} from '@business/core/controller/baseController';

@injectable()
@JsonController(RoutingAPI.Geographic)
export class GeographicController extends BaseController {
  constructor(
    @inject(COMMON_TYPES.MemoryCache) private memoryCache: ICacheBase,
  ) {
    super();
  }

  @Get('/countries')
  @ResponseSchema(CountryDto, { isArray: true })
  async getCountries(): Promise<ResponseResult<CountryDto[]>> {
    const result = await this.memoryCache.getAsync(
      CacheKey.GeographicCountries,
      async () => {
        return countries as Array<CountryDto>;
      },
    );
    return this.Ok(true, result);
  }
}
