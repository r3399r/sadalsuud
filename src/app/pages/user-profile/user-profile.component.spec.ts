import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { UserService } from 'src/app/services/user.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getLineUser',
      'getUser',
    ]);
    userServiceSpy.getLineUser.and.resolveTo({ userId: 'test' } as any);

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
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
