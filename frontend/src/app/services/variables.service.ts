import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VariablesParams, VariablesResponse } from '@y-celestial/sadalsuud-service';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  private variables: VariablesResponse;

  constructor(private http: HttpClient) {
    this.variables = {};
  }

  public async getVariables(...names: (keyof VariablesResponse)[]): Promise<VariablesResponse> {
    let unsavedNames: (keyof VariablesResponse)[] = [];

    names.forEach((v: keyof VariablesResponse) => {
      if (this.variables[v] === undefined) unsavedNames.push(v);
    });

    if (unsavedNames.length === 0) return this.variables;

    const params: VariablesParams = { name: unsavedNames.join() };
    const variables$ = this.http.get<VariablesResponse>(`${environment.apiEndponit}/variables`, {
      params,
    });
    const newVariables = await lastValueFrom(variables$);
    this.variables = { ...this.variables, ...newVariables };

    return this.variables;
  }
}
