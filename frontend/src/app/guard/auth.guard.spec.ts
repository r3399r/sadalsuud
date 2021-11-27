import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { LoginService } from 'src/app/services/login.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.Spy;

  beforeEach(() => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['checkLoginStatus']);
    routerSpy = spyOn(Router.prototype, 'parseUrl');

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: LoginService, useValue: loginServiceSpy }],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect', () => {
    loginServiceSpy.checkLoginStatus.and.returnValue(false);
    guard.canActivate();
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });

  it('should return true', () => {
    loginServiceSpy.checkLoginStatus.and.returnValue(true);
    guard.canActivate();
    expect(routerSpy).toHaveBeenCalledTimes(0);
  });
});
