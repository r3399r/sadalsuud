import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login.component';
import { VariablesService } from 'src/app/services/variables.service';
import { AuthService } from 'src/app/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let variablesServiceSpy: jasmine.SpyObj<VariablesService>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    variablesServiceSpy = jasmine.createSpyObj('VariablesService', ['getVariables']);
    routerSpy = spyOn(Router.prototype, 'navigate');
    variablesServiceSpy.getVariables.and.resolveTo({ lineLoginId: 'test' });

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: VariablesService, useValue: variablesServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should work', async () => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.isLoginProcessing || component.isGettingVariables).toBeFalse();
    });
  });

  it('loginProcess should work', async () => {
    authServiceSpy.login.and.resolveTo();
    component.loginProcess({});

    fixture.whenStable().then(() => {
      expect(routerSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('loginProcess should work if login failed', async () => {
    authServiceSpy.login.and.rejectWith(new Error('message'));
    component.loginProcess({});

    fixture.whenStable().then(() => {
      expect(routerSpy).toHaveBeenCalledTimes(0);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });
});
