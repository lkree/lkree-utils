const { default: BundleDeclarationsWebpackPlugin } = require('bundle-declarations-webpack-plugin');
const path = require('path');

module.exports = {
  createDeclarations: (filePath, rootPath) =>
    new BundleDeclarationsWebpackPlugin({
      entry: filePath,
      outFile: 'index.d.ts',
      compilationOptions: {
        followSymlinks: true,
        preferredConfigPath: path.resolve(rootPath, 'tsconfig.json'),
      },
      removeEmptyLines: false,
      removeEmptyExports: false,
      removeRelativeReExport: false
    })
};
