import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PostTripRequest, Trip } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { Location } from '@angular/common';
import { TripService } from 'src/app/services/trip.service';
import { momentValidator } from 'src/app/util/validator';
import { DialogComponent } from 'src/app/pages/trips/dialog/dialog.component';

@Component({
  selector: 'app-trip-editor',
  templateUrl: './trip-editor.component.html',
  styleUrls: ['./trip-editor.component.scss'],
})
export class TripEditorComponent implements OnInit {
  isLoading = false;
  editId: string | undefined;
  minDate = new Date();
  tripForm = this.fb.group({
    date: [moment(null), [Validators.required, momentValidator()]],
    startTime: ['', [Validators.pattern(/^([0-1][0-9]|2[0-3])[0-5][0-9]$/), Validators.required]],
    endTime: ['', [Validators.pattern(/^([0-1][0-9]|2[0-3])[0-5][0-9]$/), Validators.required]],
    place: ['', Validators.required],
    meetPlace: ['', Validators.required],
    dismissPlace: ['', Validators.required],
    briefDesc: ['', Validators.required],
    detailDesc: ['', Validators.required],
    fee: this.fb.array([]),
    needAccompany: [false],
  });

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private tripService: TripService,
    private snackBar: MatSnackBar,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const trip = (this.location.getState() as { data: any }).data as Trip;
    if (trip !== undefined) {
      this.editId = trip.id;
      this.tripForm.controls['date'].setValue(moment(trip.startDatetime * 1000));
      this.tripForm.controls['startTime'].setValue(
        moment(trip.startDatetime * 1000).format('HHmm'),
      );
      this.tripForm.controls['endTime'].setValue(moment(trip.endDatetime * 1000).format('HHmm'));
      this.tripForm.controls['place'].setValue(trip.place);
      this.tripForm.controls['meetPlace'].setValue(trip.meetPlace);
      this.tripForm.controls['dismissPlace'].setValue(trip.dismissPlace);
      this.tripForm.controls['briefDesc'].setValue(trip.briefDesc);
      this.tripForm.controls['detailDesc'].setValue(trip.detailDesc);
      this.tripForm.controls['needAccompany'].setValue(trip.needAccompany);
      trip.fee.forEach((fee: Trip['fee'][0]) => {
        this.fees.push(
          this.fb.group({
            what: [fee.what, Validators.required],
            cost: [fee.cost, Validators.required],
          }),
        );
      });
    }
  }

  onCancel() {
    this.router.navigate(['trips']);
  }

  onSubmit() {
    if (this.isValid()) {
      const date = this.tripForm.value.date.format('YYYY/MM/DD');
      const data: PostTripRequest = {
        startDatetime: moment(
          `${date} ${this.insertAt(this.tripForm.value.startTime, ':', 2)}`,
        ).unix(),
        endDatetime: moment(`${date} ${this.insertAt(this.tripForm.value.endTime, ':', 2)}`).unix(),
        place: this.tripForm.value.place,
        meetPlace: this.tripForm.value.meetPlace,
        dismissPlace: this.tripForm.value.dismissPlace,
        fee: this.tripForm.value.fee,
        briefDesc: this.tripForm.value.briefDesc,
        detailDesc: this.tripForm.value.detailDesc,
        needAccompany: this.tripForm.value.needAccompany,
      };
      const dialogRef = this.dialog.open<DialogComponent, PostTripRequest>(DialogComponent, {
        data,
      });

      dialogRef.afterClosed().subscribe((data: PostTripRequest) => {
        if (data) this.onFormSubmit(data);
      });
    }
  }

  private insertAt(str: string, sub: string, pos: number) {
    return `${str.slice(0, pos)}${sub}${str.slice(pos)}`;
  }

  private isValid(): boolean {
    if (!this.tripForm.valid) return false;
    const start = Number(this.tripForm.value.startTime);
    const end = Number(this.tripForm.value.endTime);
    if (start >= end) {
      this.tripForm.controls['startTime'].setErrors({ incorrect: true });
      this.tripForm.controls['endTime'].setErrors({ incorrect: true });
      return false;
    }
    return true;
  }

  private onFormSubmit(data: PostTripRequest) {
    this.isLoading = true;
    if (this.editId !== undefined)
      this.tripService
        .editTrip(this.editId, data)
        .then(() => {
          this.router.navigate([`trips/${this.editId}`]);
        })
        .catch((e) => {
          this.snackBar.open(e.message, undefined, { duration: 4000 });
        })
        .finally(() => {
          this.isLoading = false;
        });
    else
      this.tripService
        .createTrip(data)
        .then(() => {
          this.router.navigate(['user']);
        })
        .catch((e) => {
          this.snackBar.open(e.message, undefined, { duration: 4000 });
        })
        .finally(() => {
          this.isLoading = false;
        });
  }

  get fees() {
    return this.tripForm.get('fee') as FormArray;
  }

  addFee() {
    this.fees.push(
      this.fb.group({ what: ['', Validators.required], cost: ['', Validators.required] }),
    );
  }

  removeFee(i: number) {
    this.fees.removeAt(i);
  }
}
