import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GetTripResponse } from '@y-celestial/sadalsuud-service';
import { TripDetailComponent } from './trip-detail.component';
import { TripService } from 'src/app/services/trip.service';

describe('TripDetailComponent', () => {
  let component: TripDetailComponent;
  let fixture: ComponentFixture<TripDetailComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getTrip']);
    tripServiceSpy.getTrip.and.resolveTo();

    await TestBed.configureTestingModule({
      declarations: [TripDetailComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: TripService, useValue: tripServiceSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getDate should work', () => {
    expect(component.getDate(1643590800)).toBe('2022/01/31');
  });

  it('getTime should work', () => {
    expect(component.getTime(1643590800)).toBe('09:00');
  });
});
