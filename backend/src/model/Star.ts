import { entity, primaryAttribute } from '@y-celestial/service';

export type Star = {
  id: string;
  name: string;
  nickname: string;
  birthday: string;
  dateCreated: number;
  dateUpdated: number;
};

/**
 * Entity class for Star
 */
@entity('star')
export class StarEntity implements Star {
  @primaryAttribute()
  public id: string;
  public name: string;
  public nickname: string;
  public birthday: string;
  public dateCreated: number;
  public dateUpdated: number;

  constructor(input: Star) {
    this.id = input.id;
    this.name = input.name;
    this.nickname = input.nickname;
    this.birthday = input.birthday;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
  }
}

export type PostStarRequest = {
  name: string;
  nickname: string;
  birthday: string;
};

export type PostStarResponse = Star;
