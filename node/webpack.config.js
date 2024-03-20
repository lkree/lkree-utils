import {
  createNodeLibraryConfig,
  createWebpackSettingsToConfig,
  excludeLibraryCallback
} from 'lkree-webpack-utils';

export default createWebpackSettingsToConfig().map((props) =>
  createNodeLibraryConfig({
    ...props,
    modeEnv: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    externals: [excludeLibraryCallback(/lkree-common-utils/)],
    optimization: {
      minimize: false
    },
  })
);
