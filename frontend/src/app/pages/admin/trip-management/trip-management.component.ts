import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GetTripsResponse } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trip-management',
  templateUrl: './trip-management.component.html',
  styleUrls: ['./trip-management.component.scss'],
})
export class TripManagementComponent implements AfterViewInit {
  trips: MatTableDataSource<GetTripsResponse[0]> = new MatTableDataSource<GetTripsResponse[0]>();
  displayedColumns = ['owner', 'place', 'datetime'];

  constructor(private tripService: TripService, private router: Router) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.tripService.getUnverifiedTrips().then((res: GetTripsResponse) => {
      this.trips = new MatTableDataSource(res);
      this.trips.sort = this.sort;
    });
  }

  getDatetime(start: number, end: number) {
    const startString = moment.unix(start).format('YYYY/MM/DD HH:mm');
    const endString = moment.unix(end).format('HH:mm');
    return `${startString}~${endString}`;
  }

  onRowClick(row: GetTripsResponse[0]) {
    this.router.navigate([`trips/${row.id}`]);
  }
}
