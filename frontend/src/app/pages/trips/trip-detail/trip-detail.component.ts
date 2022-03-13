import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GetMeResponse, GetTripResponse, ROLE } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { Sign } from 'src/app/model/Sign';
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
  minDate = new Date();
  expiredDate: Date | undefined;

  isSubmitting = false;
  setMemberForm = this.fb.group({
    groupId: ['', Validators.required],
  });

  signedList: MatTableDataSource<Sign> = new MatTableDataSource<Sign>();
  displayedColumns = ['type', 'name', 'birthday', 'phone', 'edit'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private tripService: TripService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      Promise.all([this.userService.getUser(), this.tripService.getTrip(id ?? 'xxx')])
        .then(async ([user, trip]: [GetMeResponse, GetTripResponse]) => {
          this.user = user;
          this.trip = trip;

          if (user.role === ROLE.ADMIN || user.id === trip.owner.id) {
            const signedList = await this.tripService.getSignedList(trip.id);
            this.signedList = new MatTableDataSource(signedList);
            this.signedList.sort = this.sort;
          }
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

  onEdit() {
    this.router.navigate(['trips/editor'], { state: { data: this.trip } });
  }

  getDate(datetime: number | null) {
    if (datetime === null) return 'no date';
    return moment.unix(datetime).format('YYYY/MM/DD');
  }

  getTime(datetime: number) {
    return moment.unix(datetime).format('HH:mm');
  }

  dateChange(e: MatDatepickerInputEvent<Date>) {
    this.expiredDate = e.target.value ?? undefined;
  }

  onVerify() {
    if (this.expiredDate === undefined) return;
    this.tripService
      .verifyTrip(this.trip!.id, { expiredDatetime: moment(this.expiredDate).unix() })
      .then(() => {
        this.snackBar.open('success', undefined, { duration: 4000 });
      })
      .catch(() => {
        this.snackBar.open('failed', undefined, { duration: 4000 });
      });
  }

  copyId() {
    this.snackBar.open('Group ID is copied.', undefined, { duration: 4000 });
  }

  canViewSigned() {
    if (this.user === undefined || this.trip === undefined) return false;
    if (this.user.role === ROLE.ADMIN || this.trip.owner.id === this.user.id) return true;
    return false;
  }

  onSubmit() {
    if (!this.setMemberForm.valid) return;
    this.isSubmitting = true;
    const groupIds = this.setMemberForm.value.groupId;

    this.tripService
      .setMember(this.trip!.id, groupIds)
      .then(() => {
        this.snackBar.open('success', undefined, { duration: 4000 });
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }
}
