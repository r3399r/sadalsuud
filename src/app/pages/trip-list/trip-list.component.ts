import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from 'src/app/services/trip.service';
import { DateHelper } from 'src/app/util/date-helper';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  private router: Router;
  private tripService: TripService;
  public trips: any;
  private dateHelper: DateHelper;

  constructor(router: Router, tripService: TripService) {
    this.router = router;
    this.tripService = tripService;
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
  }

  public onClickCard(id: string): void {
    this.router.navigate([`trip-detail/${id}`]);
  }
}
