import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginService } from 'src/app/services/login.service';
import { VariablesService } from 'src/app/services/variables.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let variablesServiceSpy: jasmine.SpyObj<VariablesService>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    variablesServiceSpy = jasmine.createSpyObj('VariablesService', ['getVariables']);
    routerSpy = spyOn(Router.prototype, 'navigate');

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: LoginService, useValue: loginServiceSpy },
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
    variablesServiceSpy.getVariables.and.resolveTo({ lineLoginId: 'test' });
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.isLoading).toBeFalse();
    });
  });

  it('loginProcess should work', async () => {
    loginServiceSpy.login.and.resolveTo();
    component.loginProcess({});

    fixture.whenStable().then(() => {
      expect(routerSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('loginProcess should work', async () => {
    loginServiceSpy.login.and.rejectWith();
    component.loginProcess({});

    fixture.whenStable().then(() => {
      expect(routerSpy).toHaveBeenCalledTimes(0);
      expect(matSnackBarSpy.open).toHaveBeenCalledTimes(1);
    });
  });
});
