import { injectable } from 'inversify';
import { VariablesResponse } from 'src/model/Variable';

/**
 * Service class to return required parameters
 */
@injectable()
export class VariablesService {
  public getParameters(name: string): VariablesResponse {
    const nameArray: (keyof VariablesResponse)[] = name.split(
      ','
    ) as (keyof VariablesResponse)[];
    const res: VariablesResponse = {};
    for (const val of nameArray) {
      const envVariable = process.env[val] as keyof VariablesResponse;
      if (envVariable !== undefined) res[val] = envVariable;
    }

    return res;
  }
}
