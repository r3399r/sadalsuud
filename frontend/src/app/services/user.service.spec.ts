import { TestBed } from '@angular/core/testing';
import { HttpClientService } from './http-client.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClientService, useValue: httpClientSpy }],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUser should work', async () => {
    await service.getUser();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('addUser should work', async () => {
    await service.addUser({ name: 'a', phone: 'b', birthday: 'c' });
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });
});
