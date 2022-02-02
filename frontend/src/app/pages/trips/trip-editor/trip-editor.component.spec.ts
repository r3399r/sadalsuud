import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { TripEditorComponent } from './trip-editor.component';
import { TripService } from 'src/app/services/trip.service';

describe('TripEditorComponent', () => {
  let component: TripEditorComponent;
  let fixture: ComponentFixture<TripEditorComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    tripServiceSpy = jasmine.createSpyObj('TripService', ['editTrip', 'createTrip']);
    matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    locationSpy = jasmine.createSpyObj('Location', ['getState']);
    routerSpy = spyOn(Router.prototype, 'navigate');

    locationSpy.getState.and.returnValue({} as unknown);

    await TestBed.configureTestingModule({
      declarations: [TripEditorComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      providers: [
        { provide: TripService, useValue: tripServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onCancel should work', () => {
    component.onCancel();
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });
});
