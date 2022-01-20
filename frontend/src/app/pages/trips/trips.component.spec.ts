import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TripsComponent } from './trips.component';
import { TripService } from 'src/app/services/trip.service';

describe('TripsComponent', () => {
  let component: TripsComponent;
  let fixture: ComponentFixture<TripsComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getTrips']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    tripServiceSpy.getTrips.and.resolveTo();

    await TestBed.configureTestingModule({
      declarations: [TripsComponent],
      providers: [
        { provide: TripService, useValue: tripServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
