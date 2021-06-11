export interface IResponseBase {
  message?: string;
  errors?: string[];
}

export interface IResponse<T> extends IResponseBase {
  result: T;
}

export class ResponseSuccess<T> implements IResponse<T> {
  constructor(data: IResponse<T>) {
    this.message = data.message;
    this.result = data.result;
  }

  private failed = false;
  errors: string[];
  result: T;
  message: string;
}

export class ResponseError implements IResponseBase {
  constructor(data: IResponseBase) {
    this.message = data.message;
    this.errors = data.errors;
  }

  private failed = true;
  errors: string[];
  message: string;
}
