const { default: BundleDeclarationsWebpackPlugin } = require('bundle-declarations-webpack-plugin');
const path = require('path');

module.exports = {
    createDeclarations: (entry, rootPath) => Object.entries(entry).map(([fileName, filePath]) =>
        new BundleDeclarationsWebpackPlugin({
            entry: filePath,
            outFile: `${fileName}.d.ts`,
            compilationOptions: {
                followSymlinks: true,
                preferredConfigPath: path.resolve(rootPath, 'tsconfig.json'),
            },
            removeEmptyLines: false,
            removeEmptyExports: false,
            removeRelativeReExport: false
        })
    )
};
