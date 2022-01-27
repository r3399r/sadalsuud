import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GetTripResponse } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss'],
})
export class TripDetailComponent implements OnInit {
  trip: GetTripResponse | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tripService: TripService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.tripService
        .getTrip(id ?? 'xxx')
        .then((res: GetTripResponse) => {
          this.trip = res;
        })
        .catch(() => {
          this.router.navigate(['trips']);
        });
    });
  }

  getDate(datetime: number) {
    return moment.unix(datetime).format('YYYY/MM/DD');
  }

  getTime(datetime: number) {
    return moment.unix(datetime).format('HH:mm');
  }
}
