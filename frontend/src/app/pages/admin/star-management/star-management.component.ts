import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { GetStarsResponse } from '@y-celestial/sadalsuud-service';
import moment from 'moment';
import { StarService } from 'src/app/services/star.service';
import { momentValidator } from 'src/app/util/validator';

@Component({
  selector: 'app-star-management',
  templateUrl: './star-management.component.html',
  styleUrls: ['./star-management.component.scss'],
})
export class StarManagementComponent implements AfterViewInit {
  isSubmitting = false;
  stars: MatTableDataSource<GetStarsResponse[0]> = new MatTableDataSource<GetStarsResponse[0]>([]);
  displayedColumns = ['name', 'nickname', 'birthday', 'nGroups'];
  addStarForm = this.fb.group({
    name: ['', Validators.required],
    nickname: ['', Validators.required],
    birthday: [moment(), [momentValidator(), Validators.required]],
  });

  constructor(
    private starService: StarService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.starService.getAllStars().then((res: GetStarsResponse) => {
      this.stars = new MatTableDataSource(res);
      this.stars.sort = this.sort;
    });
  }

  onRefresh() {
    this.starService.refreshAllStars().then((res: GetStarsResponse) => {
      this.stars = new MatTableDataSource(res);
      this.stars.sort = this.sort;
    });
  }

  onSubmit() {
    if (!this.addStarForm.valid) return;
    this.isSubmitting = true;
    const data = {
      name: this.addStarForm.value.name,
      nickname: this.addStarForm.value.nickname,
      birthday: moment(this.addStarForm.value.birthday).format('YYYY/MM/DD'),
    };
    this.starService
      .addStar(data)
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

  onRowClick(row: GetStarsResponse[0]) {
    this.router.navigate([`stars/${row.id}`]);
  }
}
