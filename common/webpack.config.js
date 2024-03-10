import {
  createLibraryConfig,
  createWebpackSettingsToConfig,
} from 'lkree-webpack-utils';

export default createWebpackSettingsToConfig().map((props) =>
  createLibraryConfig({
    ...props,
    modeEnv: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  })
);
