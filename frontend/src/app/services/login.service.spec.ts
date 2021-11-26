import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { VariablesService } from './variables.service';

describe('LoginService', () => {
  let service: LoginService;
  let variablesServiceSpy: jasmine.SpyObj<VariablesService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    variablesServiceSpy = jasmine.createSpyObj('VariablesService', ['getVariables']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: VariablesService, useValue: variablesServiceSpy }],
    });
    service = TestBed.inject(LoginService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('checkLoginStatus should work', () => {
    expect(service.checkLoginStatus()).toBeFalse();
    localStorage.setItem('access_token', 'test');
    expect(service.checkLoginStatus()).toBeTrue();
    localStorage.removeItem('access_token');
  });

  it('getLineLoginUrl should work', () => {
    const randomId = Math.random().toString();
    expect(service.getLineLoginUrl(randomId)).toContain(`client_id=${randomId}`);
  });
});
