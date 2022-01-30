import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GetMeResponse, GetTripResponse, ROLE } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { TripService } from 'src/app/services/trip.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.scss'],
})
export class TripDetailComponent implements OnInit {
  trip: GetTripResponse | undefined;
  user: GetMeResponse | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tripService: TripService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.userService
      .getUser()
      .then((res: GetMeResponse) => {
        this.user = res;
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      });
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

  onSign(groupInfo: GetMeResponse['myGroup'][0]) {
    this.tripService
      .signTrip(this.trip!.id, { groupId: groupInfo.group.id })
      .then(() => {
        this.snackBar.open('報名成功', undefined, { duration: 4000 });
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      });
  }

  buttonName(groupInfo: GetMeResponse['myGroup'][0]) {
    if (groupInfo.group.star === undefined) return '以志工的身分報名';
    return `幫 ${groupInfo.group.star.nickname} 報名`;
  }

  showEdit() {
    if (this.user?.role === ROLE.ADMIN) return true;
    return false;
  }

  getDate(datetime: number) {
    return moment.unix(datetime).format('YYYY/MM/DD');
  }

  getTime(datetime: number) {
    return moment.unix(datetime).format('HH:mm');
  }
}
