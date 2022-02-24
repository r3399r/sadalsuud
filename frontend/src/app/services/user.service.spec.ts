import { TestBed } from '@angular/core/testing';
import { PostUserRequest, PutUserRequest } from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;
  let postUserData: PostUserRequest;
  let putUserData: PutUserRequest;

  beforeAll(() => {
    postUserData = {
      name: 'a',
      phone: 'b',
      birthday: 'c',
    };
    putUserData = {
      name: 'a',
      phone: 'b',
      birthday: 'c',
    };
  });

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get', 'post', 'put']);
    httpClientSpy.get.and.resolveTo('good');
    httpClientSpy.post.and.resolveTo('good');
    httpClientSpy.put.and.resolveTo('good');

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

  it('getUser should work with multiple calls', async () => {
    await service.getUser();
    await service.getUser();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('refreshUser should work', async () => {
    await service.refreshUser();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('getUser should throw unexpected error', async () => {
    httpClientSpy.get.and.rejectWith(new Error('message'));
    await expectAsync(service.getUser()).toBeRejected();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('addUser should work', async () => {
    await service.addUser(postUserData);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('addUser should throw unexpected error', async () => {
    httpClientSpy.post.and.rejectWith(new Error('message'));
    await expectAsync(service.addUser(postUserData)).toBeRejected();
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('updateUser should work', async () => {
    await service.updateUser(putUserData);
    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
  });

  it('updateUser should throw unexpected error', async () => {
    httpClientSpy.put.and.rejectWith(new Error('message'));
    await expectAsync(service.updateUser(putUserData)).toBeRejected();
    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
  });

  it('getAllUsers should work', async () => {
    await service.getAllUsers();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('refreshAllUsers should work', async () => {
    await service.refreshAllUsers();
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('updateUserStatus should work', async () => {
    await service.updateUserStatus('id', {});
    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
  });
});
