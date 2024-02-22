const path = require('path');
const { getEntries } = require('./createFilePaths');

module.exports = function () {
    const rootPath = path.resolve(__dirname, '../');
    const srcPath = path.resolve(rootPath, 'src/');

    const r = Object.entries(getEntries(srcPath));

    console.log(r);

    return r.map(([name, filePath]) => {

      return ({
        entry: {
          [name]: filePath
        },
        rootPath,
        outputPath: path.resolve(rootPath, `build/${name}`),
        globalOutputPath: path.resolve(rootPath, 'build/'),
        webpackAliases: {
            '~': srcPath,
        },
    })})
};
