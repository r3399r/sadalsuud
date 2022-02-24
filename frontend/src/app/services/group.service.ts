import { Injectable } from '@angular/core';
import {
  ACTION,
  GetGroupsResponse,
  PostGroupRequest,
  PostGroupResponse,
} from '@y-celestial/sadalsuud-service';
import { PatchGroupRequest } from '@y-celestial/sadalsuud-service/lib/src/model/Group';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groups: GetGroupsResponse | undefined;

  constructor(private http: HttpClientService) {}

  public async getAllGroups(): Promise<GetGroupsResponse> {
    if (this.groups === undefined) this.groups = await this.http.get<GetGroupsResponse>('groups');
    return this.groups;
  }

  public async refreshAllGroups(): Promise<GetGroupsResponse> {
    this.groups = await this.http.get<GetGroupsResponse>('groups');
    return this.groups;
  }

  public async addGroup(data: PostGroupRequest): Promise<PostGroupResponse> {
    return await this.http.post<PostGroupResponse, PostGroupRequest>('groups', data);
  }

  public async addGroupMember(groupId: string, userId: string): Promise<void> {
    await this.http.patch<any, PatchGroupRequest>(`groups/${groupId}`, {
      action: ACTION.ADD,
      userId,
    });
  }

  public async removeGroupMember(groupId: string, userId: string): Promise<void> {
    await this.http.patch<any, PatchGroupRequest>(`groups/${groupId}`, {
      action: ACTION.REMOVE,
      userId,
    });
  }
}