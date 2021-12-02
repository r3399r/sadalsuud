import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClientService } from './http-client.service';

describe('HttpClientService', () => {
  let service: HttpClientService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.Spy;
  let dummyResult: any;

  beforeAll(() => {
    dummyResult = { a: '123' };
  });

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['request']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLogin', 'refreshToken']);
    routerSpy = spyOn(Router.prototype, 'navigate');

    httpClientSpy.request.and.returnValue(of(dummyResult));
    authServiceSpy.isLogin.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
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

    await expectAsync(service.get('url')).toBeRejectedWithError('login failed');
  });

  it('get should fail if localStorage is abnormal', async () => {
    httpClientSpy.request.and.returnValue(throwError(() => ({ error: { message: 'xx' } })));

    await expectAsync(service.get('url')).toBeRejectedWithError('xx');
  });

  it('post should work', async () => {
    expect(await service.post('url', {})).toEqual(dummyResult);
  });
});
