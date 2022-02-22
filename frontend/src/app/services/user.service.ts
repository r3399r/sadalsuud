import { Injectable } from '@angular/core';
import {
  GetMeResponse,
  GetUsersResponse,
  PostUserRequest,
  PostUserResponse,
  PutUserRequest,
  PutUserResponse,
  PutUserRoleRequest,
  PutUserRoleResponse,
} from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: GetMeResponse | undefined;

  constructor(private http: HttpClientService) {}

  public async getUser(): Promise<GetMeResponse> {
    if (this.user !== undefined) return this.user;
    this.user = await this.http.get<GetMeResponse>('me');
    return this.user;
  }

  public async refreshUser() {
    this.user = await this.http.get<GetMeResponse>('me');
  }

  public async addUser(data: PostUserRequest) {
    return await this.http.post<PostUserResponse, PostUserRequest>('users', data);
  }

  public async updateUser(data: PutUserRequest) {
    return await this.http.put<PutUserResponse, PutUserRequest>('users', data);
  }

  public async getAllUsers(): Promise<GetUsersResponse> {
    return await this.http.get<GetUsersResponse>('users');
  }

  public async updateUserStatus(id: string, data: PutUserRoleRequest): Promise<PutUserRoleRequest> {
    return await this.http.put<PutUserRoleResponse, PutUserRoleRequest>(`users/${id}/status`, data);
  }
}
