/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://aqua-test.lucky-star-trip.net/',
      changeOrigin: true,
    }),
  );
};
