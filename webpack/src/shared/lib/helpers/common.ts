import BundleDeclarationsWebpackPlugin from 'bundle-declarations-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { AnyFunction } from 'lkree-common-utils/ts';
import { computeDirName } from 'lkree-node-utils/lib/helpers';

import {
  DEFAULT_SERVER_BUILD_DIRECTORY,
  getDefaultTsConfigPath,
  getDefaultWebpackAliases,
  getHTMLPath,
  getSrcPath,
} from '~/shared/const';
import { INDEX_JS_FILE_NAME } from '~/shared/lib/helpers/const';

import { getEntries, getEntriesKeys, getExportsPath } from './filePathsHelpers';

export const createWebpackSettingsToConfig = (
  {
    buildDirectory = DEFAULT_SERVER_BUILD_DIRECTORY,
    entries = getEntries(getSrcPath()),
    getEntryNameAsFolderName = true,
    webpackAliases = getDefaultWebpackAliases(),
  }: {
    entries?: Record<string, string>;
    buildDirectory?: string;
    webpackAliases?: Record<string, string>;
    getEntryNameAsFolderName?: boolean;
  } = {
    buildDirectory: DEFAULT_SERVER_BUILD_DIRECTORY,
    entries: getEntries(getSrcPath()),
    getEntryNameAsFolderName: true,
    webpackAliases: getDefaultWebpackAliases(),
  }
) =>
  Object.entries(entries).map(([name, filePath]) => ({
    entry: {
      [name]: filePath,
    },
    outputPath: getEntryNameAsFolderName
      ? computeDirName(`/${buildDirectory}/${name}`)
      : computeDirName(`/${buildDirectory}`),
    webpackAliases,
  }));

export const getDefaultDeclarationSettings = (
  {
    filePath,
    tsConfigPath = getDefaultTsConfigPath(),
  }: {
    filePath: string;
    tsConfigPath?: string;
  } = {
    filePath: '',
    tsConfigPath: getDefaultTsConfigPath(),
  }
) => ({
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

export const createDeclarations = (
  {
    declarationSettings = {},
    filePath,
    tsConfigPath = getDefaultTsConfigPath(),
  }: {
    filePath: string;
    tsConfigPath?: string;
    declarationSettings?: Partial<ConstructorParameters<typeof BundleDeclarationsWebpackPlugin>>[0];
  } = {
    declarationSettings: {},
    filePath: '',
    tsConfigPath: getDefaultTsConfigPath(),
  }
) =>
  // eslint-disable-next-line new-cap
  new (BundleDeclarationsWebpackPlugin as unknown as { default: typeof BundleDeclarationsWebpackPlugin }).default({
    ...getDefaultDeclarationSettings({ filePath, tsConfigPath }),
    ...declarationSettings,
  });

export const getDefaultPackageJSONRewritableFields = () => ({
  exports: getExportsPath(getSrcPath()),
  files: getEntriesKeys(getSrcPath()),
  main: `./${INDEX_JS_FILE_NAME}`,
  type: 'module',
});

export const getDonePlugin =
  () => (compiler: { hooks: { done: { tap: (action: string, callback: AnyFunction) => any } } }) =>
    compiler.hooks.done.tap('DonePlugin', () => setTimeout(() => process.exit(0)));

export const excludeLibraryCallback =
  (librariesRegex: RegExp, importType = 'module') =>
  ({ request }: { context: unknown; request: string }, callback: AnyFunction) => {
    if (librariesRegex.test(request)) {
      // Externalize to a commonjs module using the request path
      return callback(null, `${importType} ${request}`);
    }

    // Continue without externalizing the import
    callback();
  };

export const getHTMLPlugin = (htmlPath: string = getHTMLPath()) =>
  new HtmlWebpackPlugin({
    inject: true,
    template: htmlPath,
  });
