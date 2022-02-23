import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetStarsResponse } from '@y-celestial/sadalsuud-service';
import { StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-star-management',
  templateUrl: './star-management.component.html',
  styleUrls: ['./star-management.component.scss'],
})
export class StarManagementComponent implements AfterViewInit {
  stars: MatTableDataSource<GetStarsResponse[0]> = new MatTableDataSource<GetStarsResponse[0]>([]);
  displayedColumns = ['name', 'nickname', 'birthday', 'nGroups'];

  constructor(private starService: StarService) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.starService.getAllStars().then((res: GetStarsResponse) => {
      this.stars = new MatTableDataSource(res);
      this.stars.sort = this.sort;
    });
  }
}
