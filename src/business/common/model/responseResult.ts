

export interface ResponseResult<T = any> {
  success: boolean;
  message: string;
  data: T | T[];
  code: number;
  errors: string[];
}
