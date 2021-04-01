import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LineAuthService } from 'src/app/services/line-auth.service';
import { TripService } from 'src/app/services/trip.service';
import { UserService } from 'src/app/services/user.service';
import { DateHelper } from 'src/app/util/date-helper';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  private router: Router;
  private tripService: TripService;
  private lineAuthService: LineAuthService;
  private userService: UserService;
  private dateHelper: DateHelper;

  public trips: any;
  public user: any;

  constructor(
    router: Router,
    tripService: TripService,
    lineAuthService: LineAuthService,
    userService: UserService
  ) {
    this.router = router;
    this.tripService = tripService;
    this.userService = userService;
    this.lineAuthService = lineAuthService;
    this.dateHelper = new DateHelper();
  }

  async ngOnInit(): Promise<void> {
    const res: any[] = await this.tripService.getTrips();
    this.trips = res.map((trip: any) => {
      return {
        ...trip,
        date: this.dateHelper.getDate(trip.startDate),
        startDate: this.dateHelper.hhmm(trip.startDate),
        endDate: this.dateHelper.hhmm(trip.endDate),
      };
    });

    const isLogin: boolean = await this.lineAuthService.isAuth();
    if (isLogin === true) this.user = await this.userService.getMe();
    else this.user = {};
  }

  public onClickCard(id: string): void {
    this.router.navigate([`trip-detail/${id}`]);
  }

  public onClickAddTrip(): void {
    this.router.navigate(['add-trip']);
  }
}
