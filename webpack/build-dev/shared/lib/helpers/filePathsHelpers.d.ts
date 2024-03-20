export type Rules = Record<string, (folder: string) => boolean>;
export declare const defaultFolderFilter: (folder: string) => boolean;
export declare const INDEX_FILES_RULES: {
    '\\\\lib\\\\': (folder: string) => boolean;
};
export declare const getEntries: (folder: string) => Record<string, string>;
export declare const getEntriesKeys: (folder: string, rules?: Rules) => string[];
export declare const getExportsPath: (folder: string) => Record<string, string>;
