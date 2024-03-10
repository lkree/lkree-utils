import { computeDirName } from 'lkree-node-utils/lib/helpers';

export const getRootPath = () => computeDirName('/');
export const getSrcPath = () => computeDirName('/src/');

export const getDefaultWebpackAliases = () => ({
  '~': getSrcPath(),
});

export const getDefaultPackageJSONPath = () => `${getRootPath()}/package.json`;

export const getDefaultBuildPackageJSONPath = (buildDirectory: string = DEFAULT_SERVER_BUILD_DIRECTORY) =>
  `${getRootPath()}/${buildDirectory}/package.json`;

export const getDefaultTsConfigPath = () => `${getRootPath()}/tsconfig.json`;

export const getHTMLPath = () => `${getRootPath()}/public/index.html`;

export const DEFAULT_SERVER_BUILD_DIRECTORY = 'build';

export const DEFAULT_FRONTEND_BUILD_DIRECTORY = 'dist';
