import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LineUserProfile } from 'src/app/model/LineUserProfile';
import { UserService } from 'src/app/services/user.service';

describe('UserService', () => {
  let service: UserService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dummyLineUser: LineUserProfile;

  beforeAll(() => {
    dummyLineUser = {
      userId: 'testUesrId',
      displayName: 'testDisplayName',
    };
  });

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLineUser() should work', async () => {
    httpClientSpy.get.and.returnValue(of(dummyLineUser));
    expect(await service.getLineUser()).toBe(dummyLineUser);
  });

  it('getUser() should work', async () => {
    httpClientSpy.get.and.returnValue(of(dummyLineUser));
    expect(await service.getUser('testId')).toBe(dummyLineUser);
  });
});
