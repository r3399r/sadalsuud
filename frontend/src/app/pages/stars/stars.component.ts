import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { GetMeResponse, GetStarResponse, ROLE } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { StarService } from 'src/app/services/star.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent implements OnInit {
  star: GetStarResponse | undefined;
  user: GetMeResponse | undefined;
  isEdit: Map<string, string> = new Map();

  newRecord: [string, string] = ['', ''];
  isSubmittable = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private starService: StarService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.userService.getUser().then((res: GetMeResponse) => (this.user = res));
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.starService
        .getStar(id ?? 'xxx')
        .then((res: GetStarResponse) => {
          this.star = res;
        })
        .catch(() => {
          this.router.navigate(['/']);
        });
    });
  }

  getDate(ts: number) {
    return moment(ts).format('YYYY/MM/DD HH:mm:ss');
  }

  onEdit(id: string, content: string) {
    this.isEdit.set(id, content);
  }

  onInput(id: string, e: KeyboardEvent) {
    this.isEdit.set(id, (e.target as HTMLInputElement).value);
  }

  onSubmit(id: string) {
    this.starService
      .reviseRecord({ recordId: id, content: this.isEdit.get(id)! })
      .then(() => {
        this.snackBar.open('success, please reload', undefined, { duration: 4000 });
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      })
      .finally(() => {
        this.isEdit.delete(id);
      });
  }

  onCancel(id: string) {
    this.isEdit.delete(id);
  }

  isAdmin() {
    if (this.user?.role === ROLE.ADMIN) return true;
    return false;
  }

  onInputReporter(e: KeyboardEvent) {
    this.newRecord[0] = (e.target as HTMLInputElement).value;
    if (this.newRecord[0] !== '' && this.newRecord[1] !== '') this.isSubmittable = true;
    else this.isSubmittable = false;
  }

  onInputNewRecord(e: KeyboardEvent) {
    this.newRecord[1] = (e.target as HTMLInputElement).value;
    if (this.newRecord[0] !== '' && this.newRecord[1] !== '') this.isSubmittable = true;
    else this.isSubmittable = false;
  }

  onSubmitNewRecord() {
    this.starService
      .createRecord({
        reporterId: this.newRecord[0],
        targetId: this.star?.id ?? 'xxx',
        content: this.newRecord[1],
      })
      .then(() => {
        this.snackBar.open('success, please reload', undefined, { duration: 4000 });
      })
      .catch((e) => {
        this.snackBar.open(e.message, undefined, { duration: 4000 });
      });
  }
}
