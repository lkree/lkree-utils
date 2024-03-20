import fs from 'node:fs';
import { getSrcPath } from '../../../shared/const/index.js';
import { INDEX_JS_FILE_NAME, INDEX_TS_FILE_NAME } from './const.js';
export const defaultFolderFilter = (folder) => folder.lastIndexOf(INDEX_TS_FILE_NAME) >= 0;
export const INDEX_FILES_RULES = {
    '\\\\lib\\\\': (folder) => folder.lastIndexOf(INDEX_TS_FILE_NAME) >= 0 && folder.split('\\').length === 4,
};
const getIndexFilesPaths = (folder, rules) => 
// eslint-disable-next-line
fs.readdirSync(folder, { recursive: true }).filter((folder) => Object.entries(rules)
    .find(([rule]) => folder.match(new RegExp(rule)))
    ?.at(1)?.(folder) ?? defaultFolderFilter(folder));
const getEntreKey = (indexFilePath) => indexFilePath
    .split('\\')
    .reduce((r, part) => `${r}/${[INDEX_TS_FILE_NAME, 'shared'].includes(part) ? '' : part}`, '')
    .slice(1) || '/';
const _getEntries = (indexFilesPaths) => indexFilesPaths.reduce((result, indexFilePath) => {
    result[getEntreKey(indexFilePath)] = `${getSrcPath()}/${indexFilePath}`;
    return result;
}, {});
export const getEntries = (folder) => _getEntries(getIndexFilesPaths(folder, INDEX_FILES_RULES));
export const getEntriesKeys = (folder, rules = INDEX_FILES_RULES) => getIndexFilesPaths(folder, rules).map(getEntreKey);
export const getExportsPath = (folder) => getIndexFilesPaths(folder, INDEX_FILES_RULES).reduce((r, indexFilePath) => {
    const key = getEntreKey(indexFilePath);
    if (!key) {
        r['.'] = `./${key}`;
    }
    else {
        const mKey = `.${key}`;
        r[mKey.slice(0, mKey.length - 1)] = `${mKey}${INDEX_JS_FILE_NAME}`;
    }
    return r;
}, {});
