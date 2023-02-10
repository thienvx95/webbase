import { isEmpty } from 'lodash';
import { toBool } from '@core/ultis';
import { PaginateRequest } from '@business/common/model/pagingation/paginateRequest';
import { PaginateQuery } from '@business/common/model/pagingation/PaginateQuery';

export class BuildQuery {
  static convertToQuery(request: PaginateRequest): PaginateQuery {
    const query = new PaginateQuery();
    if (!isEmpty(request.sort)) {
      query.options.sort = [];
      Object.keys(request.sort).forEach((x) => {
        query.options.sort.push([
          x,
          request.sort[x] === 'ascend' ? 'asc' : 'desc',
        ]);
      });
    } else {
      query.options.sort = [['createdAt', 'desc']];
    }
    if (!isEmpty(request.search)) {
      Object.keys(request.search).forEach((x) => {
        if (!isEmpty(request.search[x])) {
          Object.assign(query.query, {
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
          Object.assign(query.query, { [`${x}`]: { $in: value } });
        }
      });
    }
    query.options.limit = request.limit;
    query.options.page = request.page;
    query.options.lean = true;
    return query;
  }
}
