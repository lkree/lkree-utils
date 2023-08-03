const path = require('path');

const getEntries = (srcPath) => ({
    api: path.resolve(srcPath, 'shared/api/index.ts'),
    const: path.resolve(srcPath, 'shared/const/index.ts'),
    helpers: path.resolve(srcPath, 'shared/lib/helpers/index.ts'),
    ts: path.resolve(srcPath, 'shared/lib/ts/index.ts')
});

module.exports = function () {
    const rootPath = path.resolve(__dirname, '../');
    const srcPath = path.resolve(rootPath, 'src/');

    return Object.entries(getEntries(srcPath)).map(entry => ({
        entry: {
          [entry[0]]: entry[1]
        },
        rootPath,
        outputPath: path.resolve(rootPath, `build/${entry[0]}`),
        globalOutputPath: path.resolve(rootPath, 'build/'),
        webpackAliases: {
            '~': srcPath,
        },
    }))
};
