import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarManagementComponent } from './star-management.component';
import { StarService } from 'src/app/services/star.service';

describe('StarManagementComponent', () => {
  let component: StarManagementComponent;
  let fixture: ComponentFixture<StarManagementComponent>;
  let starServiceSpy: jasmine.SpyObj<StarService>;

  beforeEach(async () => {
    starServiceSpy = jasmine.createSpyObj('StarService', ['getAllStars']);
    starServiceSpy.getAllStars.and.resolveTo();

    await TestBed.configureTestingModule({
      declarations: [StarManagementComponent],
      providers: [{ provide: StarService, useValue: starServiceSpy }],
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
});
