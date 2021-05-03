import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LineUserProfile } from 'src/app/model/LineUserProfile';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http: HttpClient;
  private readonly lineProfileUrl: string = 'https://api.line.me/v2/profile';
  private readonly userApi: string = `${environment.api}/users`;

  private user: any;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public async getLineUser(): Promise<LineUserProfile> {
    const accessToken: string | null = localStorage.getItem('access_token');

    return await this.http
      .get<LineUserProfile>(this.lineProfileUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();
  }

  public async getUser(): Promise<any> {
    try {
      const lineUser = await this.getLineUser();

      if (this.user === undefined)
        this.user = await this.http
          .get<any>(`${this.userApi}/${lineUser.userId}`)
          .toPromise();

      return this.user;
    } catch (e) {
      return undefined;
    }
  }
}
