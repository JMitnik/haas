const withTM = require('next-transpile-modules')(['@haas/ui']); // pass the modules you would like to see transpiled

module.exports = {
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
  ...withTM(),
};
