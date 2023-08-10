import { isEmpty } from 'lodash';
import { PaginationOptions } from 'mongoose-paginate-ts';
import { toBool } from '@core/ultis';
import { PaginateRequest } from '@business/common/model/pagingation/paginateRequest';

export class BuildQuery {
  static convertToQuery(request: PaginateRequest): PaginationOptions {
    let sort = [];
    const query = {};
    if (!isEmpty(request.sort)) {
      Object.keys(request.sort).forEach((x) => {
        sort.push([x, request.sort[x] === 'ascend' ? 'asc' : 'desc']);
      });
    } else {
      sort = [['createdAt', 'desc']];
    }
    if (!isEmpty(request.search)) {
      Object.keys(request.search).forEach((x) => {
        if (!isEmpty(request.search[x])) {
          Object.assign(query, {
            [`${x}`]: { $regex: `^${request.search[x]}`, $options: 'i' },
          });
        }
      });
    }

    if (!isEmpty(request.filter)) {
      Object.keys(request.filter).forEach((x) => {
        if (!isEmpty(request.filter[x])) {
          let value = request.filter[x];
          if (['isActive'].includes(x)) {
            value = value.map((x) => toBool(x as string));
          }
          Object.assign(query, { [`${x}`]: { $in: value } });
        }
      });
    }
    return {
      sort,
      query,
      limit: request.limit,
      page: request.page,
      lean: true,
    };
  }
}
