import axios from 'axios';
import { bindings } from 'src/bindings';
import { LineService } from './LineService';

jest.mock('axios');

/**
 * Tests of the LineService class.
 */
describe('LineService', () => {
  let lineService: LineService;
  let mockAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    lineService = bindings.get<LineService>(LineService);
    mockAxios = axios as jest.Mocked<typeof axios>;

    mockAxios.get.mockResolvedValue({ data: { test: 1 } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('verifyToken should work', async () => {
    await lineService.verifyToken('test-token');
    expect(mockAxios.get).toBeCalledTimes(1);
  });

  it('getProfile should work', async () => {
    await lineService.getProfile('test-token');
    expect(mockAxios.get).toBeCalledTimes(1);
  });
});
