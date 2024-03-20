import fs from 'node:fs/promises';
import { getDefaultBuildPackageJSONPath, getDefaultPackageJSONPath } from '../../../shared/const/index.js';
import { getDefaultPackageJSONRewritableFields } from './common.js';
export const rewritePackageJson = async ({ packageJSONDestinationPath = getDefaultBuildPackageJSONPath(), packageJSONFields = getDefaultPackageJSONRewritableFields(), packageJSONPath = getDefaultPackageJSONPath(), } = {
    packageJSONDestinationPath: getDefaultBuildPackageJSONPath(),
    packageJSONFields: getDefaultPackageJSONRewritableFields(),
    packageJSONPath: getDefaultPackageJSONPath(),
}) => {
    const writeFile = (filePath, destinationPath, content) => fs
        .readFile(filePath, { encoding: 'utf8' })
        .then(JSON.parse)
        .then(async (fileContent) => {
        let a;
        try {
            a = await fs.open(destinationPath, 'w+');
            await a.write(JSON.stringify({ ...fileContent, ...content }, null, 2));
        }
        finally {
            await a.close();
        }
    });
    await writeFile(packageJSONPath, packageJSONDestinationPath, packageJSONFields);
};
