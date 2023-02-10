export class PaginateQuery {
  query?: Record<string, unknown> = {};
  options?: PaginateOptions = new PaginateOptions();
}

export class PaginateOptions {
  sort?: Array<Array<string>>;
  page?: number;
  limit?: number;
  lean: boolean;
}
