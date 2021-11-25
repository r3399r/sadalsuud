import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VariablesParams, VariablesResponse } from '@y-celestial/sadalsuud-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  public getParameter(...names: (keyof VariablesResponse)[]) {
    const params: VariablesParams = { name: names.join() };
    return this.http.get<VariablesResponse>(`${environment.apiEndponit}/variables`, {
      params,
    });
  }
}
