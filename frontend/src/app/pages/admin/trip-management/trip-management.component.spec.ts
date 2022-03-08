import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TripManagementComponent } from './trip-management.component';
import { TripService } from 'src/app/services/trip.service';

describe('TripManagementComponent', () => {
  let component: TripManagementComponent;
  let fixture: ComponentFixture<TripManagementComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getUnverifiedTrips']);
    tripServiceSpy.getUnverifiedTrips.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TripManagementComponent],
      providers: [{ provide: TripService, useValue: tripServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
