import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ERROR } from 'src/app/locales/errors';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  public async get<T>(
    url: string,
    params?: {
      [param: string]: string | number | boolean;
    },
  ) {
    try {
      const accessToken = localStorage.getItem('access_token');
      const expireAt = localStorage.getItem('expire_at');

      if (!this.authService.isLogin()) throw new Error('token info incomplete');

      if (Date.now() > Number(expireAt) - 24 * 60 * 60 * 1000) this.authService.refreshToken();

      const headers = { 'x-api-token': accessToken! };
      const observable$ = this.http.get<T>(`${environment.apiEndpoint}/${url}`, {
        headers,
        params,
      });
      return await lastValueFrom(observable$);
    } catch (e) {
      this.router.navigate(['login']);
      this.snackBar.open(ERROR.TOKEN_EXPIRED, undefined, { duration: 4000 });
      throw new Error('login failed');
    }
  }
}
