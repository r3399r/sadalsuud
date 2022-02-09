import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetMeResponse, ROLE } from '@y-celestial/sadalsuud-service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserComponent } from './user.component';
import { UserService } from 'src/app/services/user.service';
import { ROLE as ROLE_LOCALE } from 'src/app/locales/role';
import { AuthService } from 'src/app/services/auth.service';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'addUser', 'updateUser']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    userServiceSpy.getUser.and.resolveTo();
    userServiceSpy.addUser.and.resolveTo();
    userServiceSpy.updateUser.and.resolveTo();
    routerSpy = spyOn(Router.prototype, 'navigate');

    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fail when create', () => {
    userServiceSpy.getUser.and.rejectWith();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  it('onFormSubmit should work with add', () => {
    component.onFormSubmit({ type: 'add', data: {} as any });
    fixture.whenStable().then(() => {
      expect(userServiceSpy.addUser).toHaveBeenCalledTimes(1);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(0);
    });
  });

  it('onFormSubmit should fail with add', () => {
    userServiceSpy.addUser.and.rejectWith();
    component.onFormSubmit({ type: 'add', data: {} as any });
    fixture.whenStable().then(() => {
      expect(userServiceSpy.addUser).toHaveBeenCalledTimes(0);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  it('onFormSubmit should work with edit', () => {
    component.onFormSubmit({ type: 'edit', data: {} as any });
    fixture.whenStable().then(() => {
      expect(userServiceSpy.updateUser).toHaveBeenCalledTimes(1);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(0);
    });
  });

  it('onFormSubmit should fail with edit', () => {
    userServiceSpy.updateUser.and.rejectWith();
    component.onFormSubmit({ type: 'edit', data: {} as any });
    fixture.whenStable().then(() => {
      expect(userServiceSpy.updateUser).toHaveBeenCalledTimes(0);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  it('onCancel should work', () => {
    component.onCancel();
    expect(component.isEdit).toBeFalse();
  });

  it('getRole should work', () => {
    expect(component.getRole(ROLE.PASSERBY)).toBe(ROLE_LOCALE.PASSERBY);
    expect(component.getRole(ROLE.ROOKIE)).toBe(ROLE_LOCALE.ROOKIE);
    expect(component.getRole(ROLE.GOOD_PARTNER)).toBe(ROLE_LOCALE.PARTNER);
    expect(component.getRole(ROLE.GOOD_PLANNER)).toBe(ROLE_LOCALE.PLANEER);
    expect(component.getRole(ROLE.ADMIN)).toBe(ROLE_LOCALE.ADMIN);
    expect(component.getRole('xxx' as ROLE)).toBe(ROLE_LOCALE.PASSERBY);
  });

  it('isAdmin should work', () => {
    expect(component.isAdmin()).toBeFalse();

    userServiceSpy.getUser.and.resolveTo({ role: ROLE.ADMIN } as GetMeResponse);
    fixture.detectChanges();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.isAdmin()).toBeTrue();
    });
  });

  it('onClick should work', () => {
    component.onClick();
    expect(component.isEdit).toBeTrue();
  });

  it('onLogout should work', () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
  });

  it('onClickAdmin should work', () => {
    component.onClickAdmin();
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });
});
