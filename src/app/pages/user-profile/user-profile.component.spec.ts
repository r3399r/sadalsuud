import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { ParameterService } from 'src/app/services/parameter.service';
import { UserService } from 'src/app/services/user.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let parameterServiceSpy: jasmine.SpyObj<ParameterService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getLineUser',
      'getUser',
    ]);
    userServiceSpy.getLineUser.and.resolveTo({ userId: 'test' } as any);

    parameterServiceSpy = jasmine.createSpyObj('ParameterService', [
      'getParameter',
    ]);

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ParameterService, useValue: parameterServiceSpy },
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
  });
});
