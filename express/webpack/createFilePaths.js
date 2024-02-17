const fs = require('fs');
const path = require("path");

const INDEX_FILES_RULES = {
  '\\api\\': folder => folder.lastIndexOf('index.ts') >= 0,
  '\\lib\\': folder => folder.lastIndexOf('index.ts') >= 0 && folder.split('\\').length === 4
};


const getIndexFilesPaths = folder => (
  fs.readdirSync(folder, { recursive: true }).filter(folder => {
    const [, ruleFn] = Object.entries(INDEX_FILES_RULES).find(([rule]) => folder.indexOf(rule) >= 0) ?? [];

    return ruleFn ? ruleFn(folder) : false;
  })
);

const getEntreKey = indexFilePath => (
  indexFilePath
    .split('\\')
    .reduce((r, part) => `${r}/${['index.ts', 'shared'].includes(part) ? '' : part}`, '')
    .slice(1)
);

const _getEntries = (indexFilesPaths, startFolder) => indexFilesPaths.reduce((result, indexFilePath) => {
  result[getEntreKey(indexFilePath)] = path.resolve(startFolder, indexFilePath);

  return result;
}, {});


module.exports = {
  getEntries: folder => _getEntries(getIndexFilesPaths(folder), folder),
  getEntriesKeys: folder => getIndexFilesPaths(folder).map(getEntreKey),
}
