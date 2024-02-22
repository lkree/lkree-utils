const fs = require('node:fs/promises');
const path = require('node:path');
const { getEntriesKeys, getExportsPath } = require('../webpack/createFilePaths');

const rootPath = path.resolve(__dirname, '../');
const srcPath = path.resolve(rootPath, 'src/');

(async () => {
  const writeFile = async (filePath, destinationPath, content) => {
    fs.readFile(filePath, { encoding: 'utf8' }).then(JSON.parse).then(async (fileContent) => {
      let a;

      try {
        a = await fs.open(destinationPath, 'w+');
        await a.write(JSON.stringify({ ...fileContent, ...content }, null, 2));
      } finally {
        await a.close();
      }
    });
  };

  await writeFile(
    `${rootPath}/package.json`,
    `${rootPath}/build/package.json`,
    {
      files: getEntriesKeys(srcPath),
      exports: getExportsPath(srcPath),
      type: 'module',
      main: './index.js',
    });
})();
