import { Component, OnInit } from '@angular/core';
import { LineUserProfile } from 'src/app/model/LineUserProfile';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  private userService: UserService;
  public lineUserProfile: LineUserProfile;
  public user: any;
  public lineChannelUrl: string;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async ngOnInit(): Promise<void> {
    this.lineUserProfile = await this.userService.getLineUser();
    this.user = await this.userService.getUser(this.lineUserProfile.userId);
    this.lineChannelUrl = 'https://lin.ee/IdbKMOe';
  }
}
