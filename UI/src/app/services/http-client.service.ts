import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { AuthService } from './auth.service';
import { Paging, Sorting, DataFilter } from '../shared/models/common';
import { filter } from 'lodash';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

export interface IHttpClientService {
  get<T>(endPoint: string, options?: IRequestOptions): Promise<T>;
  post<T>(
    endPoint: string,
    params: object,
    options?: IRequestOptions,
  ): Promise<T>;
  put<T>(
    endPoint: string,
    params: object,
    options?: IRequestOptions,
  ): Promise<T>;
  delete<T>(endPoint: string, options?: IRequestOptions): Promise<T>;
  setPaging(paging: Paging, httpParams: HttpParams): HttpParams;
  setSorting(sorting: Sorting[], httpParams: HttpParams): HttpParams;
  setFilters(filters: [], httpParams: HttpParams): HttpParams;
}

@Injectable({
  providedIn: 'root',
})
export class HttpClientService implements IHttpClientService {
  private url: string;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService,
    private authService: AuthService,
  ) {
    this.url = this.environmentService.apiUrl;
  }

  get<T>(endPoint: string, params?: object, options?: IRequestOptions): Promise<T> {
    return this.http
      .get<T>(this.url + endPoint, this.SetHeaders(options))
      .toPromise();
  }

  post<T>(
    endPoint: string,
    params: object,
    options?: IRequestOptions,
  ): Promise<T> {
    return this.http
      .post<T>(this.url + endPoint, params, this.SetHeaders(options))
      .toPromise();
  }

  put<T>(
    endPoint: string,
    params: object,
    options?: IRequestOptions,
  ): Promise<T> {
    return this.http
      .put<T>(this.url + endPoint, params, this.SetHeaders(options))
      .toPromise();
  }

  delete<T>(endPoint: string, options?: IRequestOptions): Promise<T> {
    return this.http
      .delete<T>(this.url + endPoint, this.SetHeaders(options))
      .toPromise();
  }

  setPaging(paging: Paging, httpParams: HttpParams): HttpParams {
    if (paging) {
      httpParams = httpParams.append('skip', paging.skip.toString()).append('take', paging.take.toString());
    }
    return httpParams;
  }

  setSorting(sorting: Sorting[], httpParams: HttpParams): HttpParams {
    if (sorting && sorting.length > 0) {
      const sortingParams = sorting.map(x => `${x.propertyName}:${x.sort}`).join(',');
      httpParams = httpParams.append('sort', sortingParams);
    }

    return httpParams;
  }

  setFilters(filters: DataFilter[], httpParams: HttpParams): HttpParams {
    if (filters && filters.length > 0) {
      filters.forEach(x => {
        httpParams = httpParams.append(`filters[${x.fieldName}][${x.searchOperator}]`, x.searchValue);
      });
    }

    return httpParams;
  }

  private SetHeaders(options?: IRequestOptions): IRequestOptions {
    const token = this.authService.getAuthorizationHeaderValue();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.append('Authorization', token);
    }

    return { ...options, headers } as any;
  }
}
