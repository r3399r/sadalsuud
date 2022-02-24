import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StarManagementComponent } from './star-management.component';
import { StarService } from 'src/app/services/star.service';

describe('StarManagementComponent', () => {
  let component: StarManagementComponent;
  let fixture: ComponentFixture<StarManagementComponent>;
  let starServiceSpy: jasmine.SpyObj<StarService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    starServiceSpy = jasmine.createSpyObj('StarService', ['getAllStars', 'refreshAllStars']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    starServiceSpy.getAllStars.and.resolveTo();
    starServiceSpy.refreshAllStars.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [StarManagementComponent],
      providers: [
        { provide: StarService, useValue: starServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onRefresh should work', () => {
    component.onRefresh();
    fixture.whenStable().then(() => {
      expect(starServiceSpy.refreshAllStars).toHaveBeenCalledTimes(1);
    });
  });
});
