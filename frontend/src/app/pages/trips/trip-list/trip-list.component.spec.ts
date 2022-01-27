import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { TripListComponent } from './trip-list.component';
import { TripService } from 'src/app/services/trip.service';

describe('TripListComponent', () => {
  let component: TripListComponent;
  let fixture: ComponentFixture<TripListComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getTrips']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    tripServiceSpy.getTrips.and.resolveTo();

    await TestBed.configureTestingModule({
      declarations: [TripListComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: TripService, useValue: tripServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripListComponent);
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
