import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ROLE, STATUS } from '@y-celestial/sadalsuud-service';
import { UserManagementComponent } from './user-management.component';
import { ROLE as ROLE_LOCALE, STATUS as STATUS_LOCALE } from 'src/app/locales/user';
import { UserService } from 'src/app/services/user.service';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers', 'updateUserStatus']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    userServiceSpy.getAllUsers.and.resolveTo();
    userServiceSpy.updateUserStatus.and.resolveTo();

    await TestBed.configureTestingModule({
      declarations: [UserManagementComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addRole should work', () => {
    component.addRole({ value: ROLE.PASSERBY } as MatSelectChange, 'id');
    expect(component.isEdit.has('id')).toBeTrue();
  });

  it('addStatus should work', () => {
    component.addStatus({ value: STATUS.VERIFIED } as MatSelectChange, 'id');
    expect(component.isEdit.has('id')).toBeTrue();
  });

  it('getRole should work', () => {
    expect(component.getRole(ROLE.PASSERBY)).toBe(ROLE_LOCALE.PASSERBY);
  });

  it('getUserStatus should work', () => {
    expect(component.getUserStatus(STATUS.PHONE_UPDATED)).toBe(STATUS_LOCALE.PHONE_UPDATED);
  });

  it('onEdit should work', () => {
    component.isEdit.set('id', { status: STATUS.PHONE_UPDATED });
    component.onEdit('id');

    fixture.whenStable().then(() => {
      expect(userServiceSpy.updateUserStatus).toHaveBeenCalledTimes(1);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  it('onEdit should work if isEdit does not have id', () => {
    component.onEdit('id');

    fixture.whenStable().then(() => {
      expect(userServiceSpy.updateUserStatus).toHaveBeenCalledTimes(0);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(0);
    });
  });

  it('onEdit should fail if api fail', () => {
    userServiceSpy.updateUserStatus.and.rejectWith();
    component.isEdit.set('id', { status: STATUS.PHONE_UPDATED });
    component.onEdit('id');

    fixture.whenStable().then(() => {
      expect(userServiceSpy.updateUserStatus).toHaveBeenCalledTimes(1);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });
});
