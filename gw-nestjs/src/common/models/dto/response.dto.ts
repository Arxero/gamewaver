
export interface IResponse {
  failed: boolean;
  message: string;
  data: any;
}

export class ResponseSuccess implements IResponse {
  constructor(data: any, message?: string) {
    this.failed = false;
    this.message = message;
    this.data = data;
  }
  data: any;
  failed: boolean;
  message: string;
}


export class ResponseError implements IResponse {
  constructor(data: any, message?: string) {
    this.failed = true;
    this.message = message;
    this.data = data;
  }
  data: any;
  failed: boolean;
  message: string;
}
