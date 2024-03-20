import BundleDeclarationsWebpackPlugin from 'bundle-declarations-webpack-plugin';
import type { AnyFunction } from 'lkree-common-utils/ts';
export declare const createWebpackSettingsToConfig: ({ buildDirectory, entries, webpackAliases, }?: {
    entries?: Record<string, string> | undefined;
    buildDirectory?: string | undefined;
    webpackAliases?: Record<string, string> | undefined;
}) => {
    entry: {
        [x: string]: string;
    };
    outputPath: string;
    webpackAliases: Record<string, string>;
}[];
export declare const getDefaultDeclarationSettings: ({ filePath, tsConfigPath, }?: {
    filePath: string;
    tsConfigPath?: string | undefined;
}) => {
    compilationOptions: {
        followSymlinks: boolean;
        preferredConfigPath: string;
    };
    entry: string;
    outFile: string;
    removeEmptyExports: boolean;
    removeEmptyLines: boolean;
    removeRelativeReExport: boolean;
};
export declare const createDeclarations: ({ declarationSettings, filePath, tsConfigPath, }?: {
    filePath: string;
    tsConfigPath?: string | undefined;
    declarationSettings?: Partial<ConstructorParameters<typeof BundleDeclarationsWebpackPlugin>>[0];
}) => BundleDeclarationsWebpackPlugin;
export declare const getDefaultPackageJSONRewritableFields: () => {
    exports: Record<string, string>;
    files: string[];
    main: string;
    type: string;
};
export declare const getDonePlugin: () => (compiler: {
    hooks: {
        done: {
            tap: (action: string, callback: AnyFunction) => any;
        };
    };
}) => any;
export declare const excludeLibraryCallback: (librariesRegex: RegExp) => ({ request }: {
    context: unknown;
    request: string;
}, callback: AnyFunction) => any;
