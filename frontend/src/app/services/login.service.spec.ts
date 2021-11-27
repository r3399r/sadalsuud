import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LoginService } from './login.service';
import { VariablesService } from './variables.service';

describe('LoginService', () => {
  let service: LoginService;
  let variablesServiceSpy: jasmine.SpyObj<VariablesService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    variablesServiceSpy = jasmine.createSpyObj('VariablesService', ['getVariables']);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

    TestBed.configureTestingModule({
      providers: [
        { provide: VariablesService, useValue: variablesServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('checkLoginStatus should return false if no localstorage is set', () => {
    localStorage.removeItem('access_token');
    expect(service.checkLoginStatus()).toBeFalse();
  });

  it('checkLoginStatus should return true if localstorage is set', () => {
    localStorage.setItem('access_token', 'test');
    expect(service.checkLoginStatus()).toBeTrue();
    localStorage.removeItem('access_token');
  });

  it('getLineLoginUrl should work', () => {
    const randomId = Math.random().toString();
    expect(service.getLineLoginUrl(randomId)).toContain(`client_id=${randomId}`);
  });

  it('login should work', async () => {
    variablesServiceSpy.getVariables.and.resolveTo({
      lineLoginId: 'test',
      lineChannelKey: 'testKey',
    });
    httpClientSpy.post.and.returnValue(
      of({ access_token: 'a', expires_in: 123, refresh_token: 'b' }),
    );

    sessionStorage.setItem('state', 'tempState');
    await service.login({ state: 'tempState', code: 'abcd' });

    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('login should fail', async () => {
    variablesServiceSpy.getVariables.and.resolveTo({
      lineLoginId: 'test',
      lineChannelKey: 'testKey',
    });
    httpClientSpy.post.and.returnValue(
      of({ access_token: 'a', expires_in: 123, refresh_token: 'b' }),
    );

    sessionStorage.setItem('state', 'tempState');

    await expectAsync(service.login({ state: 'notSameState', code: 'abcd' })).toBeRejectedWithError(
      'bad process',
    );
    expect(httpClientSpy.post).toHaveBeenCalledTimes(0);

    sessionStorage.removeItem('state');
  });
});
