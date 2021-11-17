import { injectable } from 'inversify';

/**
 * Service class for line bot chatting.
 */
@injectable()
export class DemoService {
  public demoFunction() {
    console.info('demo');
  }
}
