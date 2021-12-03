import { Injectable } from '@angular/core';
import { GetMeResponse, PostUserRequest, PostUserResponse } from '@y-celestial/sadalsuud-service';
import { ERROR_CODE as SERVICE_ERROR_CODE } from '@y-celestial/service';
import { HttpClientService } from './http-client.service';
import { ERROR } from 'src/app/locales/errors';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientService) {}

  public async getUser() {
    try {
      return await this.http.get<GetMeResponse>('me');
    } catch (e) {
      if (e.message === SERVICE_ERROR_CODE.RECORD_NOT_FOUND)
        throw new Error(ERROR.RECORD_NOT_FOUND);
      throw new Error(ERROR.UNEXPECTED_ERROR);
    }
  }

  public async addUser(data: PostUserRequest) {
    try {
      return await this.http.post<PostUserResponse, PostUserRequest>('users', data);
    } catch (e) {
      if (e.message === SERVICE_ERROR_CODE.RECORD_EXIST) throw new Error(ERROR.RECORD_EXIST);
      throw new Error(ERROR.UNEXPECTED_ERROR);
    }
  }
}
