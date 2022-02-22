import { Injectable } from '@angular/core';
import { GetGroupsResponse } from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClientService) {}

  public async getAllGroups(): Promise<GetGroupsResponse> {
    return await this.http.get<GetGroupsResponse>('groups');
  }
}
