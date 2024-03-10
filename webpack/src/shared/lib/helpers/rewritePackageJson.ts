import fs from 'node:fs/promises';

import { getDefaultPackageJSONPath, getDefaultBuildPackageJSONPath } from '~/shared/const';

import { getDefaultPackageJSONRewritableFields } from './common';

export type PackageJSONFields = {
  [Key: string]: string | number | boolean | Array<any> | Record<string, PackageJSONFields | string>;
};

export const rewritePackageJson = async (
  {
    packageJSONDestinationPath = getDefaultBuildPackageJSONPath(),
    packageJSONFields = getDefaultPackageJSONRewritableFields(),
    packageJSONPath = getDefaultPackageJSONPath(),
  }: {
    packageJSONPath?: string;
    packageJSONDestinationPath?: string;
    packageJSONFields?: PackageJSONFields;
  } = {
    packageJSONDestinationPath: getDefaultBuildPackageJSONPath(),
    packageJSONFields: getDefaultPackageJSONRewritableFields(),
    packageJSONPath: getDefaultPackageJSONPath(),
  }
) => {
  const writeFile = (filePath: string, destinationPath: string, content: Record<string, any>) =>
    fs
      .readFile(filePath, { encoding: 'utf8' })
      .then(JSON.parse)
      .then(async (fileContent: Record<string, any>) => {
        let a: Awaited<ReturnType<(typeof fs)['open']>>;

        try {
          a = await fs.open(destinationPath, 'w+');
          await a.write(JSON.stringify({ ...fileContent, ...content }, null, 2));
        } finally {
          await a!.close();
        }
      });

  await writeFile(packageJSONPath, packageJSONDestinationPath, packageJSONFields);
};
