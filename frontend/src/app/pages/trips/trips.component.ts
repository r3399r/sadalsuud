import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetTripsResponse, PostTripRequest } from '@y-celestial/sadalsuud-service';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
  trips: GetTripsResponse | undefined;
  isLoading = true;
  isAdd = false;

  constructor(private tripService: TripService, private snackBar: MatSnackBar) {}

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
        // this.trips = res;
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
