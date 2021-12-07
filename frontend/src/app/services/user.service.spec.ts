import { TestBed } from '@angular/core/testing';
import { PostUserRequest, PutUserRequest } from '@y-celestial/sadalsuud-service';
import { ERROR_CODE } from '@y-celestial/service';
import { HttpClientService } from './http-client.service';
import { UserService } from './user.service';
import { ERROR } from 'src/app/locales/errors';

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

  it('getUser should throw unexpected error', async () => {
    httpClientSpy.get.and.rejectWith(new Error('message'));
    await expectAsync(service.getUser()).toBeRejectedWithError(ERROR.UNEXPECTED_ERROR);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('getUser should throw record not found', async () => {
    httpClientSpy.get.and.rejectWith(new Error(ERROR_CODE.RECORD_NOT_FOUND));
    await expectAsync(service.getUser()).toBeRejectedWithError(ERROR.RECORD_NOT_FOUND);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('addUser should work', async () => {
    await service.addUser(postUserData);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('addUser should throw unexpected error', async () => {
    httpClientSpy.post.and.rejectWith(new Error('message'));
    await expectAsync(service.addUser(postUserData)).toBeRejectedWithError(ERROR.UNEXPECTED_ERROR);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('addUser should throw record exists', async () => {
    httpClientSpy.post.and.rejectWith(new Error(ERROR_CODE.RECORD_EXIST));
    await expectAsync(service.addUser(postUserData)).toBeRejectedWithError(ERROR.RECORD_EXIST);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('updateUser should work', async () => {
    await service.updateUser(putUserData);
    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
  });

  it('updateUser should throw unexpected error', async () => {
    httpClientSpy.put.and.rejectWith(new Error('message'));
    await expectAsync(service.updateUser(putUserData)).toBeRejectedWithError(
      ERROR.UNEXPECTED_ERROR,
    );
    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
  });

  it('updateUser should throw record not found', async () => {
    httpClientSpy.put.and.rejectWith(new Error(ERROR_CODE.RECORD_NOT_FOUND));
    await expectAsync(service.updateUser(putUserData)).toBeRejectedWithError(
      ERROR.RECORD_NOT_FOUND,
    );
    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
  });
});
