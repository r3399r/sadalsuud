import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LineToken } from 'src/app/model/LineToken';
import { ParameterService } from 'src/app/services/parameter.service';

@Injectable({
  providedIn: 'root',
})
export class LineAuthService {
  private readonly http: HttpClient;
  private parameterService: ParameterService;

  private loginClientId: string;
  private loginSecret: string;
  private redirectUri: string;
  private readonly state: string = '12345abcde';
  private readonly authorizationUrl: string =
    'https://access.line.me/oauth2/v2.1/authorize';
  private readonly lineOauthApiUrl: string =
    'https://api.line.me/oauth2/v2.1/token';

  constructor(http: HttpClient, parameterService: ParameterService) {
    this.http = http;
    this.parameterService = parameterService;
  }

  private async setParameters(): Promise<void> {
    this.loginClientId = await this.parameterService.getParameter(
      'SADALSUUD_LOGIN_ID'
    );
    this.loginSecret = await this.parameterService.getParameter(
      'SADALSUUD_LOGIN_SECRET'
    );
    const envr: string = await this.parameterService.getParameter('ENVR');
    this.redirectUri =
      envr === 'prod'
        ? 'https://www.lucky-star-trip.net/home'
        : `https://${envr}.lucky-star-trip.net/home`;
  }

  public async getLink(): Promise<string> {
    if (this.loginClientId === undefined) await this.setParameters();

    return `${this.authorizationUrl}?response_type=code&client_id=${this.loginClientId}&redirect_uri=${this.redirectUri}&state=${this.state}&scope=profile&bot_prompt=aggressive`;
  }

  public getState(): string {
    return this.state;
  }

  public async isAuth(): Promise<boolean> {
    const accessToken: string | null = localStorage.getItem('access_token');
    const refreshToken: string | null = localStorage.getItem('refresh_token');

    if (accessToken === null) return false;
    if (this.loginClientId === undefined) await this.setParameters();

    try {
      const body: HttpParams = new HttpParams()
        .set('client_id', this.loginClientId)
        .set('client_secret', this.loginSecret)
        .set('grant_type', 'refresh_token')
        .set('refresh_token', refreshToken);

      const refreshedlineToken: LineToken = await this.http
        .post<LineToken>(this.lineOauthApiUrl, body, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .toPromise();

      localStorage.setItem('access_token', refreshedlineToken.access_token);
      localStorage.setItem('refresh_token', refreshedlineToken.refresh_token);

      return true;
    } catch {
      return false;
    }
  }

  public async login(code: string): Promise<boolean> {
    if (this.loginClientId === undefined) await this.setParameters();
    try {
      const body: HttpParams = new HttpParams()
        .set('code', code)
        .set('redirect_uri', this.redirectUri)
        .set('client_id', this.loginClientId)
        .set('client_secret', this.loginSecret)
        .set('grant_type', 'authorization_code');

      const lineToken: LineToken = await this.http
        .post<LineToken>(this.lineOauthApiUrl, body, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .toPromise();

      localStorage.setItem('access_token', lineToken.access_token);
      localStorage.setItem('refresh_token', lineToken.refresh_token);

      return true;
    } catch {
      return false;
    }
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}
