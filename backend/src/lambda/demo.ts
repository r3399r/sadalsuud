import { bindings } from 'src/bindings';
import { DemoService } from 'src/logic/DemoService';

export async function demo(_event: any, _context: any): Promise<any> {
  const demoService: DemoService = bindings.get<DemoService>(DemoService);
  demoService.demoFunction();

  return true;
}
