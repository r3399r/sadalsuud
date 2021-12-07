import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { VariablesService } from './variables.service';
import { ERROR } from 'src/app/locales/errors';

describe('AuthService', () => {
  let service: AuthService;
  let variablesServiceSpy: jasmine.SpyObj<VariablesService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    variablesServiceSpy = jasmine.createSpyObj('VariablesService', ['getVariables']);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    variablesServiceSpy.getVariables.and.resolveTo({
      lineLoginId: 'test',
      lineChannelKey: 'testKey',
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: VariablesService, useValue: variablesServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  afterAll(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('expire_at');
    localStorage.removeItem('refresh_token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLogin should return false if no localstorage is set', () => {
    expect(service.isLogin()).toBeFalse();
  });

  it('isLogin should return true if localstorage is set', () => {
    localStorage.setItem('access_token', 'test');
    localStorage.setItem('expire_at', '1641087965096');
    localStorage.setItem('refresh_token', 'test');
    expect(service.isLogin()).toBeTrue();
  });

  it('getLineLoginUrl should work', () => {
    const randomId = Math.random().toString();
    expect(service.getLineLoginUrl(randomId)).toContain(`client_id=${randomId}`);
  });

  it('login should work', async () => {
    httpClientSpy.post.and.returnValue(
      of({ access_token: 'a', expires_in: 123, refresh_token: 'b' }),
    );

    sessionStorage.setItem('state', 'tempState');
    await service.login({ state: 'tempState', code: 'abcd' });

    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('login should fail', async () => {
    httpClientSpy.post.and.returnValue(
      of({ access_token: 'a', expires_in: 123, refresh_token: 'b' }),
    );

    sessionStorage.setItem('state', 'tempState');

    await expectAsync(service.login({ state: 'notSameState', code: 'abcd' })).toBeRejectedWithError(
      ERROR.WRONG_LOGIN_STATE,
    );
    expect(httpClientSpy.post).toHaveBeenCalledTimes(0);

    sessionStorage.removeItem('state');
  });

  it('refreshToken should work', async () => {
    httpClientSpy.post.and.returnValue(
      of({ access_token: 'a', expires_in: 123, refresh_token: 'b' }),
    );

    localStorage.setItem('refresh_token', 'token');
    await service.refreshToken();

    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });
});
