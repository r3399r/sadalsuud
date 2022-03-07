import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GetMeResponse, ROLE } from '@y-celestial/sadalsuud-service';
import { StarGuard } from './star.guard';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

describe('StarGuard', () => {
  let guard: StarGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.Spy;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLogin']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    routerSpy = spyOn(Router.prototype, 'parseUrl');

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceSpy,
        },
        {
          provide: UserService,
          useValue: userServiceSpy,
        },
      ],
    });
    guard = TestBed.inject(StarGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect', async () => {
    authServiceSpy.isLogin.and.returnValue(false);
    userServiceSpy.getUser.and.resolveTo({ role: ROLE.PASSERBY } as GetMeResponse);
    await guard.canActivate();
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });

  it('should retrun true', async () => {
    authServiceSpy.isLogin.and.returnValue(true);
    userServiceSpy.getUser.and.resolveTo({ role: ROLE.ADMIN } as GetMeResponse);
    expect(await guard.canActivate()).toBeTrue();
    expect(routerSpy).toHaveBeenCalledTimes(0);
  });
});
