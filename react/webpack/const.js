const path = require('path');

module.exports = function ({ outputDirName }) {
    const rootPath = path.resolve(__dirname, '../');
    const srcPath = path.resolve(rootPath, 'src/');

    return {
        entry: {
            index: path.resolve(srcPath, 'index.ts'),
        },
        rootPath,
        outputPath: path.resolve(rootPath, outputDirName),
        webpackAliases: {
            '~': srcPath,
        },
    };
};
