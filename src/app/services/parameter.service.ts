import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  private readonly http: HttpClient;
  private readonly ssmApi: string = `${environment.api}/ssm`;

  private parameters: { [key: string]: string };

  constructor(http: HttpClient) {
    this.http = http;
  }

  private async setParameters(): Promise<void> {
    const name: string[] = [
      'ENVR',
      'SADALSUUD_CHANNEL_URL',
      'SADALSUUD_LOGIN_ID',
      'SADALSUUD_LOGIN_SECRET',
    ];
    this.parameters = await this.http
      .get<any>(this.ssmApi, { params: { name: name.join() } })
      .toPromise();
  }

  public async getParameter(name: string): Promise<string | undefined> {
    if (this.parameters === undefined) await this.setParameters();

    return this.parameters[name];
  }
}
