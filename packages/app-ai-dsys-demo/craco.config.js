// const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // we`bpackConfig.resolve.modules = [
      //   path.resolve(__dirname, 'src'),               // Local src directory
      //   path.resolve(__dirname, 'node_modules'),      // Local node_modules (app-level)
      //   path.resolve(__dirname, '../../node_modules') // Root node_modules (monorepo root)
      // ];`

      // Turns off folder restriction itself
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ModuleScopePlugin'
      );
      return webpackConfig;
    }
  }
};