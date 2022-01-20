import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { PostTripRequest } from '@y-celestial/sadalsuud-service';
import { momentValidator } from 'src/util/validator';
import { DialogComponent } from 'src/app/pages/trips/dialog/dialog.component';

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.scss'],
})
export class TripFormComponent implements OnInit {
  @Output() emitterCancel = new EventEmitter();
  @Output() formSubmit = new EventEmitter<PostTripRequest>();
  minDate: Date = new Date();
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

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit(): void {}

  onCancel() {
    this.emitterCancel.emit();
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
        if (data) this.formSubmit.emit(data);
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

  autoGrowTextZone(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    target.style.height = '0px';
    target.style.height = target.scrollHeight + 25 + 'px';
  }
}
