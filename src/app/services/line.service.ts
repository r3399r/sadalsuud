import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LineService {
  private readonly http: HttpClient;
  private readonly lineApi: string = `${environment.api}/line`;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public async pushMessage(to: string, messages: string[]): Promise<any> {
    return await this.http
      .post<any>(`${this.lineApi}`, {
        to,
        messages,
      })
      .toPromise();
  }
}
