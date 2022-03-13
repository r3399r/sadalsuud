import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetMeResponse, GetTripResponse, ROLE } from '@y-celestial/sadalsuud-service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TripDetailComponent } from './trip-detail.component';
import { TripService } from 'src/app/services/trip.service';
import { UserService } from 'src/app/services/user.service';

describe('TripDetailComponent', () => {
  let component: TripDetailComponent;
  let fixture: ComponentFixture<TripDetailComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['getTrip', 'signTrip']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    tripServiceSpy.getTrip.and.resolveTo({ id: 'trip-id' } as GetTripResponse);
    tripServiceSpy.signTrip.and.resolveTo();
    userServiceSpy.getUser.and.resolveTo({ role: ROLE.ADMIN } as GetMeResponse);

    await TestBed.configureTestingModule({
      declarations: [TripDetailComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TripService, useValue: tripServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
      ],
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

  it('buttonName should return correct value', () => {
    expect(component.buttonName({ group: {} } as GetMeResponse['myGroup'][0])).toBe(
      '以志工的身分報名',
    );
    expect(
      component.buttonName({ group: { star: { nickname: 'Bob' } } } as GetMeResponse['myGroup'][0]),
    ).toBe('幫 Bob 報名');
  });

  it('showEdit should return correct boolean', async () => {
    expect(component.showEdit()).toBe(false);
    await fixture.whenStable();
    expect(component.showEdit()).toBe(true);
  });

  it('onSign should work', async () => {
    await fixture.whenStable();
    component.onSign({ group: { id: 'xxx' } } as GetMeResponse['myGroup'][0]);
    await fixture.whenStable();
    expect(tripServiceSpy.signTrip).toHaveBeenCalledTimes(1);
  });
});
