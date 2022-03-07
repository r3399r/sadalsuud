import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StarsComponent } from './stars.component';
import { StarService } from 'src/app/services/star.service';
import { UserService } from 'src/app/services/user.service';

describe('StarsComponent', () => {
  let component: StarsComponent;
  let fixture: ComponentFixture<StarsComponent>;
  let starServiceSpy: jasmine.SpyObj<StarService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    starServiceSpy = jasmine.createSpyObj('StarService', ['getStar']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    userServiceSpy.getUser.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [StarsComponent],
      providers: [
        { provide: StarService, useValue: starServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
