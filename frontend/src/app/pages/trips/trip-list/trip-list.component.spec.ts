import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripListComponent } from './trip-list.component';
import { TripService } from 'src/app/services/trip.service';

describe('TripListComponent', () => {
  let component: TripListComponent;
  let fixture: ComponentFixture<TripListComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getVerfiedTrips']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = spyOn(Router.prototype, 'navigate');
    tripServiceSpy.getVerfiedTrips.and.resolveTo();

    await TestBed.configureTestingModule({
      declarations: [TripListComponent],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  it('onCreate should work', () => {
    component.onCreate();
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });

  it('onTripClick should work', () => {
    component.onTripClick('test-id');
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });
});
