module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
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
}
