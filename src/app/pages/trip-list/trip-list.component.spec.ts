import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingController } from '@ionic/angular';
import { TripListComponent } from 'src/app/pages/trip-list/trip-list.component';
import { TripService } from 'src/app/services/trip.service';

describe('TripListComponent', () => {
  let component: TripListComponent;
  let fixture: ComponentFixture<TripListComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    routerSpy = spyOn(Router.prototype, 'navigate');

    tripServiceSpy = jasmine.createSpyObj('TripService', ['getTrips']);
    tripServiceSpy.getTrips.and.resolveTo([
      {
        startDate: '2020-02-28T20:00:00.000Z',
        endDate: '2020-02-28T20:00:00.000Z',
      },
    ]);

    loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
      'create',
    ]);
    loadingControllerSpy.create.and.resolveTo({
      present: async () => {},
      dismiss: async () => {},
    } as any);

    await TestBed.configureTestingModule({
      declarations: [TripListComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: TripService, useValue: tripServiceSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('onClickCard() should work', async () => {
    component.onClickCard('177BFEFF52BA1');
    expect(routerSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledWith(['trip-detail/177BFEFF52BA1']);
  });
});
