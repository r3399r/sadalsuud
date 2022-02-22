import { TestBed } from '@angular/core/testing';

import { GroupService } from './group.service';
import { HttpClientService } from './http-client.service';

describe('GroupService', () => {
  let service: GroupService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get']);
    httpClientSpy.get.and.resolveTo('good');

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
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });
});
