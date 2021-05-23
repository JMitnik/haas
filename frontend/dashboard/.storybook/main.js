const EslintWebpackPlugin = require('eslint-webpack-plugin');

disableEsLint = (e) => {
  return e.module.rules.filter(e =>
    e.use && e.use.some(e => e.options && void 0 !== e.options.useEslintrc)).forEach(s => {
      e.module.rules = e.module.rules.filter(e => e !== s)
    }), e
}

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app"
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config, { configType }) => {
    config = disableEsLint(config);

    config.module.rules.push({
      test: /\.tsx?$/,
      loader: 'ts-loader',
      exclude: /node_modules/,
      options: {
        transpileOnly: true,
        configFile: 'tsconfig.json',
      },
    });

    return {
      ...config,
      plugins: config.plugins.filter(plugin => {
        if (plugin instanceof EslintWebpackPlugin) {
          return false;
        }

        return true;
      })
    };
  },
}