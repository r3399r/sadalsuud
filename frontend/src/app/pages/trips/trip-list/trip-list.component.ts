import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GetTripsResponse, PostTripRequest } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss'],
})
export class TripListComponent implements OnInit {
  trips: GetTripsResponse | undefined;
  isLoading = true;

  constructor(
    private tripService: TripService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.tripService
      .getTrips()
      .then((res: GetTripsResponse) => {
        this.trips = res;
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onCreate() {
    this.router.navigate(['trips/editor']);
  }

  onTripClick(id: string) {
    this.router.navigate([`trips/${id}`]);
  }

  getDate(datetime: number) {
    return moment.unix(datetime).format('YYYY/MM/DD');
  }

  getTime(datetime: number) {
    return moment.unix(datetime).format('HH:mm');
  }
}
