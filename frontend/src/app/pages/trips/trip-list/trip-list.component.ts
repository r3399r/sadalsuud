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
  isAdd = false;

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

  onAdd() {
    this.isAdd = true;
  }

  onCancel() {
    this.isAdd = false;
  }

  onFormSubmit(event: PostTripRequest) {
    this.isLoading = true;
    this.tripService
      .createTrip(event)
      .then(() => {
        this.isAdd = false;
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onClick(id: string) {
    this.router.navigate([`trips/${id}`]);
  }

  getDate(datetime: number) {
    return moment.unix(datetime).format('YYYY/MM/DD');
  }

  getTime(datetime: number) {
    return moment.unix(datetime).format('HH:mm');
  }
}
