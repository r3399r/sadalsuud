import { Component, OnInit } from '@angular/core';
import { GetUserResponse, User } from '@y-celestial/sadalsuud-service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user: User | undefined;
  isLoading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUser().then((res: GetUserResponse) => {
      this.user = res;
      this.isLoading = false;
    });
  }
}
