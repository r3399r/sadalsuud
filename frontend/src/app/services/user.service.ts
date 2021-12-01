import { Injectable } from '@angular/core';
import { GetMeResponse } from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientService) {}

  public async getUser() {
    return await this.http.get<GetMeResponse>('me');
  }
}
