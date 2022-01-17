import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { VariablesService } from './variables.service';
import { ERROR } from 'src/app/locales/errors';
import { LineToken, LoginUrlParams } from 'src/app/model/Line';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private variablesService: VariablesService) {}

  public isLogin() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const expireAt = localStorage.getItem('expire_at');

    if (
      accessToken === null ||
      expireAt === null ||
      refreshToken === null ||
      !/^[0-9]+$/g.test(expireAt)
    )
      return false;
    return true;
  }

  public getLineLoginUrl(clientId: string) {
    const authhorizationUrl = 'https://access.line.me/oauth2/v2.1/authorize';
    const responseType = 'code';
    const redirectUri = `${window.location.origin}/login`;
    const state = Date.now().toString();
    const scope = 'profile';
    const botPrompt = 'normal';

    // save state for validate purpose
    localStorage.setItem('state', state);

    return `${authhorizationUrl}?${new URLSearchParams({
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      scope: scope,
      bot_prompt: botPrompt,
    })}`;
  }

  public async login(params: LoginUrlParams) {
    const state = localStorage.getItem('state');
    localStorage.removeItem('state');

    if (params.state !== state || params.code === undefined)
      throw new Error(ERROR.WRONG_LOGIN_STATE);

    const token = await this.getAccessToken(params.code);
    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('expire_at', String(Date.now() + token.expires_in * 1000));
    localStorage.setItem('refresh_token', token.refresh_token);
  }

  private async getAccessToken(code: string) {
    const variables = await this.variablesService.getVariables('lineLoginId', 'lineChannelKey');
    const body: HttpParams = new HttpParams()
      .set('client_id', variables.lineLoginId!)
      .set('client_secret', variables.lineChannelKey!)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', `${window.location.origin}/login`);

    const token$ = this.http.post<LineToken>('https://api.line.me/oauth2/v2.1/token', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return await lastValueFrom(token$);
  }

  public async refreshToken() {
    const variables = await this.variablesService.getVariables('lineLoginId', 'lineChannelKey');
    const refreshToken = localStorage.getItem('refresh_token');
    const body: HttpParams = new HttpParams()
      .set('client_id', variables.lineLoginId!)
      .set('client_secret', variables.lineChannelKey!)
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken!);

    const token$ = this.http.post<LineToken>('https://api.line.me/oauth2/v2.1/token', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const token = await lastValueFrom(token$);

    localStorage.setItem('access_token', token.access_token);
    localStorage.setItem('expire_at', String(Date.now() + token.expires_in * 1000));
    localStorage.setItem('refresh_token', token.refresh_token);
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expire_at');
    localStorage.removeItem('refresh_token');
  }
}
