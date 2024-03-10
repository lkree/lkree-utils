const path = require('path');
const { getEntries, getExportsPath } = require('./createFilePaths');

module.exports = function () {
  const rootPath = path.resolve(__dirname, '../');
  const srcPath = path.resolve(rootPath, 'src/');

  return Object.entries(getEntries(srcPath)).map(([name, filePath], i, array) => {
    console.log(getExportsPath(srcPath));

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
    })
  })
};
