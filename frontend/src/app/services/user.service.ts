import { Injectable } from '@angular/core';
import {
  GetMeResponse,
  PostUserRequest,
  PostUserResponse,
  PutUserRequest,
  PutUserResponse,
} from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientService) {}

  public async getUser() {
    return await this.http.get<GetMeResponse>('me');
  }

  public async addUser(data: PostUserRequest) {
    return await this.http.post<PostUserResponse, PostUserRequest>('users', data);
  }

  public async updateUser(data: PutUserRequest) {
    return await this.http.put<PutUserResponse, PutUserRequest>('users', data);
  }
}
