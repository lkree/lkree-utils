import {
  createDeclarations,
  createNodeLibraryConfig,
  createWebpackSettingsToConfig,
  excludeLibraryCallback,
} from './build-dev/index.js';

const modeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default createWebpackSettingsToConfig().map((props) =>
  createNodeLibraryConfig({
    ...props,
    modeEnv,
    externals: [
      { 'bundle-declarations-webpack-plugin': 'bundle-declarations-webpack-plugin' },
      { 'html-webpack-plugin': 'html-webpack-plugin' },
      excludeLibraryCallback(/lkree-node-utils/),
    ],
  }));
