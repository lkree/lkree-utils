import {
  createNodeLibraryConfig,
  createWebpackSettingsToConfig,
  excludeLibraryCallback,
} from 'lkree-webpack-utils';

export default createWebpackSettingsToConfig().map((props) => createNodeLibraryConfig(
  {
    ...props,
    modeEnv: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    externals: [{ 'express': 'express' }, /* excludeLibraryCallback(/lkree-node-utils|lkree-common-utils/) */]
  })
);
