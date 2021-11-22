import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VariablesParams, VariablesResponse } from '@y-celestial/sadalsuud-service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  public getParameter(...names: (keyof VariablesResponse)[]) {
    const params: VariablesParams = { name: names.join() };
    return this.http.get<VariablesResponse>('https://test.lucky-star-trip.net/api/variables', {
      params,
    });
  }
}
