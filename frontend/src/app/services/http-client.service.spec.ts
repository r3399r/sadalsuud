import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClientService } from './http-client.service';
import { ERROR } from 'src/app/locales/errors';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.Spy;
  let dummyResult: any;

  beforeAll(() => {
    dummyResult = { a: '123' };
  });

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['request']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLogin', 'refreshToken']);
    routerSpy = spyOn(Router.prototype, 'navigate');

    httpClientSpy.request.and.returnValue(of(dummyResult));
    authServiceSpy.isLogin.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });
    service = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get should work', async () => {
    expect(await service.get('url')).toEqual(dummyResult);
  });

  it('get should fail if localStorage is abnormal', async () => {
    authServiceSpy.isLogin.and.returnValue(false);

    await expectAsync(service.get('url')).toBeRejectedWithError(ERROR.TOKEN_EXPIRED);
  });

  it('get should fail if api fail', async () => {
    httpClientSpy.request.and.returnValue(throwError(() => ({ error: { message: 'xx' } })));

    await expectAsync(service.get('url')).toBeRejectedWithError('xx');
  });

  it('post should work', async () => {
    expect(await service.post('url', {})).toEqual(dummyResult);
  });

  it('put should work', async () => {
    expect(await service.put('url', {})).toEqual(dummyResult);
  });

  it('patch should work', async () => {
    expect(await service.patch('url', {})).toEqual(dummyResult);
  });
});
