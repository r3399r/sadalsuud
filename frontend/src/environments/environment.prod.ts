// eslint-disable-next-line
import packageJson from '../../package.json';

export const environment = {
  production: true,
  apiEndpoint: '/api',
  version: packageJson.version,
};
