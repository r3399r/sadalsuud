import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Star } from '@y-celestial/sadalsuud-service';
import { StarService } from 'src/app/services/star.service';

@Component({
  selector: 'app-star-management',
  templateUrl: './star-management.component.html',
  styleUrls: ['./star-management.component.scss'],
})
export class StarManagementComponent implements AfterViewInit {
  stars: MatTableDataSource<Star> = new MatTableDataSource<Star>([]);
  displayedColumns = ['name', 'nickname', 'birthday'];

  constructor(private starService: StarService) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.starService.getAllStars().then((res: Star[]) => {
      this.stars = new MatTableDataSource(res);
      this.stars.sort = this.sort;
    });
  }
}
