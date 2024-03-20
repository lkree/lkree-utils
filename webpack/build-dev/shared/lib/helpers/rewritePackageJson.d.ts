export type PackageJSONFields = {
    [Key: string]: string | number | boolean | Array<any> | Record<string, PackageJSONFields | string>;
};
export declare const rewritePackageJson: ({ packageJSONDestinationPath, packageJSONFields, packageJSONPath, }?: {
    packageJSONPath?: string | undefined;
    packageJSONDestinationPath?: string | undefined;
    packageJSONFields?: PackageJSONFields | undefined;
}) => Promise<void>;
