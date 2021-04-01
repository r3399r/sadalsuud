import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.scss'],
})
export class AddTripComponent implements OnInit {
  private formBuilder: FormBuilder;
  public checkoutForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.formBuilder = formBuilder;
    this.checkoutForm = this.formBuilder.group({
      date: null,
      startTime: null,
      endTime: null,
      place: null,
      meetPlace: null,
      dismissPlace: null,
      fee: null,
      thingsToBring: null,
      needFamilyAccompany: null,
      quota: null,
      shortDesc: null,
      detailedDesc: null,
      expiredDate: null,
    });
  }

  ngOnInit(): void {}

  public onSubmit(): void {
    // console.log(this.checkoutForm.value);
    this.checkoutForm.reset();
  }
}
