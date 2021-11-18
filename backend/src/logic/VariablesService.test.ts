import { bindings } from 'src/bindings';
import { VariablesService } from 'src/logic/VariablesService';

/**
 * Tests of the VariablesService class.
 */
describe('VariablesService', () => {
  let variablesService: VariablesService;

  beforeAll(() => {
    process.env = { a: 'aaa', b: 'bbb', c: 'ccc' };
  });

  beforeEach(() => {
    variablesService = bindings.get<VariablesService>(VariablesService);
  });

  it('getParameters should work', () => {
    expect(variablesService.getParameters('a,b,d')).toStrictEqual({
      a: 'aaa',
      b: 'bbb',
    });
  });
});
