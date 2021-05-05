import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingController } from '@ionic/angular';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { LineAuthService } from 'src/app/services/line-auth.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { UserService } from 'src/app/services/user.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let parameterServiceSpy: jasmine.SpyObj<ParameterService>;
  let lineAuthServiceSpy: jasmine.SpyObj<LineAuthService>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getLineUser',
      'getUser',
    ]);
    userServiceSpy.getLineUser.and.resolveTo({ userId: 'test' } as any);

    parameterServiceSpy = jasmine.createSpyObj('ParameterService', [
      'getParameter',
    ]);

    lineAuthServiceSpy = jasmine.createSpyObj('LineAuthService', ['logout']);

    loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
      'create',
    ]);
    loadingControllerSpy.create.and.resolveTo({
      present: async () => {},
      dismiss: async () => {},
    } as any);

    routerSpy = spyOn(Router.prototype, 'navigate');

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ParameterService, useValue: parameterServiceSpy },
        { provide: LineAuthService, useValue: lineAuthServiceSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    userServiceSpy.getUser.and.resolveTo(null);
    expect(component).toBeTruthy();
  });

  it('onLogout() should work', () => {
    component.onLogout();
    expect(lineAuthServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledWith(['login']);
  });

  it('getRole() should work', () => {
    expect(component.getRole('family')).toBe('星兒家人');
    expect(component.getRole('starRain')).toBe('星雨團員');
    expect(component.getRole('star')).toBe('星雨夥伴');
    expect(component.getRole('other')).toBe('待定');
  });

  it('getDate() should work', () => {
    expect(component.getDate('2000-01-01T00:00:00.000Z')).toBe('2000-01-01');
  });

  it('getAge() should work', () => {
    expect(component.getAge('2000-01-01T00:00:00.000Z')).toBe(
      new Date().getFullYear() - 2000
    );
  });
});
