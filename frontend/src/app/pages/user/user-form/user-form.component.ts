import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PostUserRequest, User } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { momentValidator } from 'src/app/util/validator';
import { DialogComponent } from 'src/app/pages/user/dialog/dialog.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() user: User | undefined;
  @Output() formSubmit = new EventEmitter<{ type: 'add' | 'edit'; data: PostUserRequest }>();
  @Output() updateCancel = new EventEmitter();
  userForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.pattern(/^[0-9]+$/), Validators.required]],
    birthday: [moment(null), [Validators.required, momentValidator()]],
  });

  constructor(private dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.user) {
      this.userForm.controls['name'].setValue(this.user.name);
      this.userForm.controls['phone'].setValue(this.user.phone);
      this.userForm.controls['birthday'].setValue(moment(this.user.birthday));
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const dialogRef = this.dialog.open<DialogComponent, PostUserRequest>(DialogComponent, {
        data: {
          name: this.userForm.value.name,
          phone: this.userForm.value.phone,
          birthday: this.userForm.value.birthday.format('YYYY/MM/DD'),
        },
      });

      dialogRef.afterClosed().subscribe((data: PostUserRequest) => {
        if (data) this.formSubmit.emit({ type: this.user ? 'edit' : 'add', data });
      });
    }
  }

  onCancel() {
    this.updateCancel.emit();
  }
}
