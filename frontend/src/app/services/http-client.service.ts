import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ERROR } from 'src/app/locales/errors';
import { ERROR_CODE } from 'src/app/constants/error';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  private async request<T, R = any>(
    method: string,
    url: string,
    body?: R,
    params?: {
      [param: string]: string | number | boolean;
    },
  ) {
    try {
      const expireAt = localStorage.getItem('expire_at');
      if (!this.authService.isLogin()) throw new Error(ERROR_CODE.TOKEN_INFO_INCOMPLETE);

      if (Date.now() > Number(expireAt) - 24 * 60 * 60 * 1000)
        await this.authService.refreshToken();

      const accessToken = localStorage.getItem('access_token');
      const headers = { 'x-api-token': accessToken! };
      const observable$ = this.http.request<T>(method, `${environment.apiEndpoint}/${url}`, {
        headers,
        params,
        body,
      });
      return await lastValueFrom(observable$);
    } catch (e) {
      if (e.message === 'invalid_grant' || e.message === ERROR_CODE.TOKEN_INFO_INCOMPLETE) {
        this.router.navigate(['login']);
        throw new Error(ERROR.TOKEN_EXPIRED);
      } else {
        throw new Error(e.error.message);
      }
    }
  }

  public async get<T>(
    url: string,
    params?: {
      [param: string]: string | number | boolean;
    },
  ) {
    return await this.request<T>('get', url, undefined, params);
  }

  public async post<T, R>(
    url: string,
    body: R,
    params?: {
      [param: string]: string | number | boolean;
    },
  ) {
    return await this.request<T, R>('post', url, body, params);
  }
}
