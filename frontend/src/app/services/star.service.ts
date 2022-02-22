import { Injectable } from '@angular/core';
import { Star, GetStarsResponse } from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class StarService {
  constructor(private http: HttpClientService) {}

  public async getAllStars(): Promise<GetStarsResponse> {
    return await this.http.get<Star[]>('stars');
  }
}
