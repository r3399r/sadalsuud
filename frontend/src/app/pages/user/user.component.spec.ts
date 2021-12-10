import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ROLE } from '@y-celestial/sadalsuud-service';
import { UserComponent } from './user.component';
import { UserService } from 'src/app/services/user.service';
import { ROLE as ROLE_LOCALE } from 'src/app/locales/role';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'addUser', 'updateUser']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    userServiceSpy.getUser.and.resolveTo();
    userServiceSpy.addUser.and.resolveTo();
    userServiceSpy.updateUser.and.resolveTo();

    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
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

  it('getRole should work', () => {
    expect(component.getRole(ROLE.PASSERBY)).toBe(ROLE_LOCALE.PASSERBY);
    expect(component.getRole(ROLE.ROOKIE)).toBe(ROLE_LOCALE.ROOKIE);
    expect(component.getRole(ROLE.GOOD_PARTNER)).toBe(ROLE_LOCALE.PARTNER);
    expect(component.getRole(ROLE.GOOD_PLANNER)).toBe(ROLE_LOCALE.PLANEER);
    expect(component.getRole(ROLE.ADMIN)).toBe(ROLE_LOCALE.ADMIN);
    expect(component.getRole('xxx' as ROLE)).toBe(ROLE_LOCALE.PASSERBY);
  });
});
