import { TestBed } from '@angular/core/testing';
import { PostGroupRequest } from '@y-celestial/sadalsuud-service';

import { GroupService } from './group.service';
import { HttpClientService } from './http-client.service';

describe('GroupService', () => {
  let service: GroupService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get', 'post', 'patch']);
    httpClientSpy.get.and.resolveTo('good');
    httpClientSpy.post.and.resolveTo('good');
    httpClientSpy.patch.and.resolveTo('good');

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClientService, useValue: httpClientSpy }],
    });
    service = TestBed.inject(GroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllGroups should work', async () => {
    await service.getAllGroups();
    await service.getAllGroups();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('refreshAllGroups should work', async () => {
    await service.refreshAllGroups();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('addGroup should work', async () => {
    await service.addGroup({} as PostGroupRequest);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('addGroupMember should work', async () => {
    await service.addGroupMember('id1', 'id2');
    expect(httpClientSpy.patch).toHaveBeenCalledTimes(1);
  });

  it('removeGroupMember should work', async () => {
    await service.removeGroupMember('id1', 'id2');
    expect(httpClientSpy.patch).toHaveBeenCalledTimes(1);
  });
});
