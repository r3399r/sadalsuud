import { injectable } from 'inversify';
import { Variables } from 'src/model/variables';

/**
 * Service class to return required parameters
 */
@injectable()
export class VariablesService {
  public getParameters(name: string): Variables {
    const nameArray: (keyof Variables)[] = name.split(
      ','
    ) as (keyof Variables)[];
    const res: Variables = {};
    for (const val of nameArray) {
      const envVariable = process.env[val] as keyof Variables;
      if (envVariable !== undefined) res[val] = envVariable;
    }

    return res;
  }
}
