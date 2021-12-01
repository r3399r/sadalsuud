import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from 'src/app/services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.Spy;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLogin']);
    routerSpy = spyOn(Router.prototype, 'parseUrl');

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect', () => {
    authServiceSpy.isLogin.and.returnValue(false);
    guard.canActivate();
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });

  it('should return true', () => {
    authServiceSpy.isLogin.and.returnValue(true);
    guard.canActivate();
    expect(routerSpy).toHaveBeenCalledTimes(0);
  });
});
