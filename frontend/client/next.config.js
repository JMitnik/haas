const withTM = require('next-transpile-modules')(['@haas/ui']); // pass the modules you would like to see transpiled
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([withTM], {
  target: 'serverless',
  async rewrites() {
    return [
      // Do not rewrite API routes
      {
        source: '/api/:any*',
        destination: '/api/:any*',
      },
      // Rewrite everything else to use `pages/index`
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: [
        {
          loader: '@svgr/webpack',
        },
      ],
    });

    return config;
  },
});
