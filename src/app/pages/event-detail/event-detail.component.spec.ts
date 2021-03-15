import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertController, LoadingController } from '@ionic/angular';
import { of } from 'rxjs';
import { EventDetailComponent } from 'src/app/pages/event-detail/event-detail.component';
import { LineAuthService } from 'src/app/services/line-auth.service';
import { LineService } from 'src/app/services/line.service';
import { TripService } from 'src/app/services/trip.service';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;
  let lineAuthServiceSpy: jasmine.SpyObj<LineAuthService>;
  let lineServiceSpy: jasmine.SpyObj<LineService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

  beforeEach(async () => {
    const routeStub: any = {
      params: of({ id: 'testId' }),
    };
    tripServiceSpy = jasmine.createSpyObj('TripService', [
      'getTrip',
      'signTrip',
    ]);
    tripServiceSpy.getTrip.and.resolveTo({
      startDate: '2020-02-28T20:00:00.000Z',
      endDate: '2020-02-28T20:00:00.000Z',
    });

    lineAuthServiceSpy = jasmine.createSpyObj('LineAuthService', [
      'isAuth',
      'isFriend',
    ]);
    lineAuthServiceSpy.isAuth.and.resolveTo(true);
    lineAuthServiceSpy.isFriend.and.resolveTo(true);

    lineServiceSpy = jasmine.createSpyObj('LineService', ['getUserProfile']);
    lineServiceSpy.getUserProfile.and.resolveTo({ userId: 'testId' } as any);

    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    alertControllerSpy.create.and.resolveTo({
      present: async () => {},
      onDidDismiss: async () => ({ role: 'confirm' }),
    } as any);

    loadingControllerSpy = jasmine.createSpyObj('LoadingController', [
      'create',
    ]);
    loadingControllerSpy.create.and.resolveTo({
      present: async () => {},
      dismiss: async () => {},
    } as any);

    await TestBed.configureTestingModule({
      declarations: [EventDetailComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: TripService, useValue: tripServiceSpy },
        { provide: LineAuthService, useValue: lineAuthServiceSpy },
        { provide: LineService, useValue: lineServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isPageLoading() should work', async () => {
    lineAuthServiceSpy.isFriend.and.resolveTo(undefined);
    await component.ngOnInit();
    expect(component.isPageLoading()).toBeTrue();
  });

  it('canSign() should work', async () => {
    await component.ngOnInit();
    expect(component.canSign()).toBeTrue();
  });

  it('onSign() should work when click yes', async () => {
    await component.onSign();
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(loadingControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('onSign() should work when click no', async () => {
    alertControllerSpy.create.and.resolveTo({
      present: async () => {},
      onDidDismiss: async () => ({}),
    } as any);
    await component.onSign();
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(loadingControllerSpy.create).toHaveBeenCalledTimes(0);
  });
});
