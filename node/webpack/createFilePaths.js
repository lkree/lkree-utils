const fs = require('fs');
const path = require("path");

const INDEX_FILE_NAME = 'index';
const INDEX_TS_FILE_NAME = `${INDEX_FILE_NAME}.ts`;
const INDEX_JS_FILE_NAME = `${INDEX_FILE_NAME}.js`;

const INDEX_FILES_RULES = {
  '\\api\\': folder => folder.lastIndexOf(INDEX_TS_FILE_NAME) >= 0,
  '\\lib\\': folder => folder.lastIndexOf(INDEX_TS_FILE_NAME) >= 0 && folder.split('\\').length === 4
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
    .reduce((r, part) => `${r}/${[INDEX_TS_FILE_NAME, 'shared'].includes(part) ? '' : part}`, '')
    .slice(1)
);

const _getEntries = (indexFilesPaths, startFolder) => indexFilesPaths.reduce((result, indexFilePath) => {
  result[getEntreKey(indexFilePath)] = path.resolve(startFolder, indexFilePath);

  return result;
}, {});


module.exports = {
  getEntries: folder => _getEntries(getIndexFilesPaths(folder), folder),
  getEntriesKeys: folder => getIndexFilesPaths(folder).map(getEntreKey),
  getExportsPath: folder => getIndexFilesPaths(folder).reduce((r, indexFilePath) => {
    const key = getEntreKey(indexFilePath);

    console.log(key);
    if (INDEX_JS_FILE_NAME === key) {
      r['.'] = key
    } else {
      const mKey = `.${key}`;

      r[mKey.slice(0, mKey.length - 1)] = `.${getEntreKey(indexFilePath)}${INDEX_JS_FILE_NAME}`;
    }

    return r;
  }, {})
}
