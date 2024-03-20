import { computeDirName } from 'lkree-node-utils/lib/helpers';
export const getRootPath = () => computeDirName('/');
export const getSrcPath = () => computeDirName('/src/');
export const getDefaultWebpackAliases = () => ({
    '~': getSrcPath(),
});
export const getDefaultPackageJSONPath = () => `${getRootPath()}/package.json`;
export const getDefaultBuildPackageJSONPath = () => `${getRootPath()}/${DEFAULT_BUILD_DIRECTORY}/package.json`;
export const getDefaultTsConfigPath = () => `${getRootPath()}/tsconfig.json`;
export const DEFAULT_BUILD_DIRECTORY = 'build';
