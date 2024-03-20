import BundleDeclarationsWebpackPlugin from 'bundle-declarations-webpack-plugin';
import { computeDirName } from 'lkree-node-utils/lib/helpers';
import { DEFAULT_BUILD_DIRECTORY, getDefaultTsConfigPath, getDefaultWebpackAliases, getSrcPath } from '../../../shared/const/index.js';
import { INDEX_JS_FILE_NAME } from '../../../shared/lib/helpers/const.js';
import { getEntries, getEntriesKeys, getExportsPath } from './filePathsHelpers.js';
export const createWebpackSettingsToConfig = ({ buildDirectory = DEFAULT_BUILD_DIRECTORY, entries = getEntries(getSrcPath()), webpackAliases = getDefaultWebpackAliases(), } = {
    buildDirectory: DEFAULT_BUILD_DIRECTORY,
    entries: getEntries(getSrcPath()),
    webpackAliases: getDefaultWebpackAliases(),
}) => Object.entries(entries).map(([name, filePath]) => ({
    entry: {
        [name]: filePath,
    },
    outputPath: computeDirName(`/${buildDirectory}/${name}`),
    webpackAliases,
}));
export const getDefaultDeclarationSettings = ({ filePath, tsConfigPath = getDefaultTsConfigPath(), } = {
    filePath: '',
    tsConfigPath: getDefaultTsConfigPath(),
}) => ({
    compilationOptions: {
        followSymlinks: true,
        preferredConfigPath: tsConfigPath,
    },
    entry: filePath,
    outFile: 'index.d.ts',
    removeEmptyExports: false,
    removeEmptyLines: false,
    removeRelativeReExport: false,
});
export const createDeclarations = ({ declarationSettings = {}, filePath, tsConfigPath = getDefaultTsConfigPath(), } = {
    declarationSettings: {},
    filePath: '',
    tsConfigPath: getDefaultTsConfigPath(),
}) => 
// eslint-disable-next-line new-cap
new BundleDeclarationsWebpackPlugin.default({
    ...getDefaultDeclarationSettings({ filePath, tsConfigPath }),
    ...declarationSettings,
});
export const getDefaultPackageJSONRewritableFields = () => ({
    exports: getExportsPath(getSrcPath()),
    files: getEntriesKeys(getSrcPath()),
    main: `./${INDEX_JS_FILE_NAME}`,
    type: 'module',
});
export const getDonePlugin = () => (compiler) => compiler.hooks.done.tap('DonePlugin', () => setTimeout(() => process.exit(0)));
export const excludeLibraryCallback = (librariesRegex) => ({ request }, callback) => {
    if (librariesRegex.test(request)) {
        // Externalize to a commonjs module using the request path
        return callback(null, `module ${request}`);
    }
    // Continue without externalizing the import
    callback();
};
