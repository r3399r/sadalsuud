import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EventListComponent } from 'src/app/pages/event-list/event-list.component';
import { TripService } from 'src/app/services/trip.service';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
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

    await TestBed.configureTestingModule({
      declarations: [EventListComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: TripService, useValue: tripServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(tripServiceSpy.getTrips).toHaveBeenCalledTimes(1);
  });

  it('onClickCard() should work', async () => {
    await component.onClickCard('177BFEFF52BA1');
    expect(routerSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledWith(['event-detail/177BFEFF52BA1']);
  });
});
