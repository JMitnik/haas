const withSvgr = require('next-plugin-svgr');

module.exports = withSvgr({
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    styledComponents: true
  },
  async rewrites() {
    return [
      {
        // Rewrite for React-Router
        source: '/:workspace/:dialogue/:any*',
        destination: '/:workspace/:dialogue',
      },
    ];
  }
});
