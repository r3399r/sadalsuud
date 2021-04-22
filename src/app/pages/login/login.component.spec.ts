import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingController } from '@ionic/angular';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { LineAuthService } from 'src/app/services/line-auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let lineAuthServiceSpy: jasmine.SpyObj<LineAuthService>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(async () => {
    lineAuthServiceSpy = jasmine.createSpyObj('LineAuthService', ['getLink']);

    loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
      'create',
    ]);
    loadingControllerSpy.create.and.resolveTo({
      present: async () => {},
      dismiss: async () => {},
    } as any);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: LineAuthService, useValue: lineAuthServiceSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
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
});
