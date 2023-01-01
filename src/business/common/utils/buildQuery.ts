import { isEmpty } from 'lodash';
import { toBool } from '@core/ultis';
import { PaginateOptions } from '../model/pagingation/paginateOptions';

export class BuildQuery {
    static convertToQuery(option: PaginateOptions): PaginateOptions {
        const query = {};
        //need to fix
        if (!isEmpty(option.sort)) {
            Object.keys(option.sort).forEach(x => {
                option.paginatedField = x;
                option.sortAscending = option.sort[x] === "ascend" ? true : false;
            });
            delete option.sort;
        } else {
            option.paginatedField = "createdAt";
            option.sortAscending = false;
            delete option.sort;
        }
        if (!isEmpty(option.search)) {
            Object.keys(option.search).forEach(x => {
                if (!isEmpty(option.search[x])) {
                    Object.assign(query, { [`${x}`]: { $regex: `^${option.search[x]}`, $options: "i" } });
                }
            });
            delete option.search;
        }
    
        if (!isEmpty(option.filter)) {
            Object.keys(option.filter).forEach(x => {
                if (!isEmpty(option.filter[x])) {
                    let value = option.filter[x];
                    if(["isActive"].includes(x)){
                        value = value.map(x => toBool(x as string));
                    }
                    Object.assign(query, { [`${x}`]: { $in: value } });
                }
            });
            delete option.filter;
        }
        option.query = query;
        return option;
    }
}
