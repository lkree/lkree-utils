import fs from 'node:fs';

import { getSrcPath } from '~/shared/const';

import { INDEX_JS_FILE_NAME, INDEX_TS_FILE_NAME } from './const';

export type Rules = Record<string, (folder: string) => boolean>;

export const defaultFolderFilter = (folder: string) => folder.lastIndexOf(INDEX_TS_FILE_NAME) >= 0;

export const INDEX_FILES_RULES = {
  '\\\\lib\\\\': (folder: string) => folder.lastIndexOf(INDEX_TS_FILE_NAME) >= 0 && folder.split('\\').length === 4,
};

const getIndexFilesPaths = (folder: string, rules: Rules): Array<string> =>
  // eslint-disable-next-line
  (fs.readdirSync(folder, { recursive: true }) as Array<string>).filter(
    (folder: string) =>
      (
        Object.entries(rules)
          .find(([rule]) => folder.match(new RegExp(rule)))
          ?.at(1) as (folder: string) => boolean
      )?.(folder) ?? defaultFolderFilter(folder)
  );

const getEntreKey = (indexFilePath: string) =>
  indexFilePath
    .split('\\')
    .reduce((r, part) => `${r}/${[INDEX_TS_FILE_NAME, 'shared'].includes(part) ? '' : part}`, '')
    .slice(1) || '/';

const _getEntries = (indexFilesPaths: Array<string>) =>
  indexFilesPaths.reduce((result, indexFilePath) => {
    result[getEntreKey(indexFilePath)] = `${getSrcPath()}/${indexFilePath}`;

    return result;
  }, {} as Record<string, string>);

export const getEntries = (folder: string) => _getEntries(getIndexFilesPaths(folder, INDEX_FILES_RULES));

export const getEntriesKeys = (folder: string, rules: Rules = INDEX_FILES_RULES) =>
  getIndexFilesPaths(folder, rules).map(getEntreKey);

export const getExportsPath = (folder: string) =>
  getIndexFilesPaths(folder, INDEX_FILES_RULES).reduce((r, indexFilePath) => {
    const key = getEntreKey(indexFilePath);

    if (!key) {
      r['.'] = `./${key}`;
    } else {
      const mKey = `.${key}`;
      r[mKey.slice(0, mKey.length - 1)] = `${mKey}${INDEX_JS_FILE_NAME}`;
    }

    return r;
  }, {} as Record<string, string>);
