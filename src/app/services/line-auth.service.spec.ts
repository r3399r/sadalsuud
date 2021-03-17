import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LineToken } from 'src/app/model/LineToken';
import { LineAuthService } from 'src/app/services/line-auth.service';
import { ParameterService } from 'src/app/services/parameter.service';

describe('LineAuthService', () => {
  let service: LineAuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let parameterServiceSpy: jasmine.SpyObj<ParameterService>;
  let localStorageGetSpy: jasmine.Spy;
  let localStorageSetSpy: jasmine.Spy;
  let dummyAccessToken: LineToken;

  beforeAll(() => {
    dummyAccessToken = {
      access_token: 'testToken',
      expires_in: 10000,
      refresh_token: 'testRefresh',
      scope: 'profile',
      token_type: 'Bearer',
    };
  });

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    parameterServiceSpy = jasmine.createSpyObj('ParameterService', [
      'getParameter',
    ]);
    parameterServiceSpy.getParameter.and.resolveTo('testParameter');

    localStorageGetSpy = spyOn(localStorage, 'getItem').and.callFake(
      (): string => 'value'
    );
    localStorageSetSpy = spyOn(localStorage, 'setItem').and.callFake(() => {});

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ParameterService, useValue: parameterServiceSpy },
      ],
    });
    service = TestBed.inject(LineAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLink() should work', async () => {
    await service.getLink();
    // second time would use saved value
    expect(await service.getLink()).toBe(
      'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=testParameter&redirect_uri=https://testParameter.lucky-star-trip.net/home&state=12345abcde&scope=profile&bot_prompt=aggressive'
    );
  });

  it('redirectUri would be different when parameter is prod', async () => {
    parameterServiceSpy.getParameter.and.resolveTo('prod');
    await service.getLink();
    // second time would use saved value
    expect(await service.getLink()).toBe(
      'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=prod&redirect_uri=https://www.lucky-star-trip.net/home&state=12345abcde&scope=profile&bot_prompt=aggressive'
    );
  });

  it('getState() should work', () => {
    expect(service.getState()).toEqual('12345abcde');
  });

  it('isAuth() should work', async () => {
    httpClientSpy.post.and.returnValue(of(dummyAccessToken));
    await service.isAuth();
    // second time would use saved value
    expect(await service.isAuth()).toBeTrue();
  });

  it('isAuth() should return false when api request fails', async () => {
    httpClientSpy.post.and.returnValue(throwError({}));
    expect(await service.isAuth()).toBeFalse();
  });

  it('isAuth() should return false when localStorage is empty', async () => {
    localStorageGetSpy.and.callFake((): null => null);
    expect(await service.isAuth()).toBeFalse();
  });

  it('login() should work', async () => {
    httpClientSpy.post.and.returnValue(of(dummyAccessToken));
    await service.login('aaa');
    expect(localStorageSetSpy).toHaveBeenCalledTimes(2);
    expect(localStorageGetSpy).toHaveBeenCalledTimes(0);
    // second time would use saved value
    expect(await service.login('aaa')).toBeTrue();
  });

  it('login() should work', async () => {
    httpClientSpy.post.and.returnValue(throwError({}));
    const res: boolean = await service.login('aaa');
    expect(res).toBeFalse();
    expect(localStorageSetSpy).toHaveBeenCalledTimes(0);
    expect(localStorageGetSpy).toHaveBeenCalledTimes(0);
  });

  it('isFriend() should work', async () => {
    httpClientSpy.get.and.returnValue(of({ friendFlag: true }));
    expect(await service.isFriend()).toBeTrue();
  });

  it('isFriend() should fail when api request fails', async () => {
    httpClientSpy.get.and.returnValue(throwError({}));
    expect(await service.isFriend()).toBeFalse();
  });
});
