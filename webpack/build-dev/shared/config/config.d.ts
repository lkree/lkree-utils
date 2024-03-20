type Configuration = Record<string, any>;
type Props = Partial<Configuration> & {
    modeEnv?: 'production' | 'development';
    outputPath?: string;
    webpackAliases?: NonNullable<Configuration['resolve']>['alias'];
};
export declare const createBaseConfig: ({ entry, modeEnv, outputPath, webpackAliases, ...rest }: Props) => {
    entry: any;
    mode: "production" | "development" | undefined;
    module: {
        rules: {
            test: RegExp;
            use: (string | {
                loader: string;
                options: {
                    poolTimeout: number;
                    workers: number;
                };
            })[];
        }[];
    };
    output: {
        filename: string;
        path: string | undefined;
    };
    resolve: {
        alias: any;
        aliasFields: string[];
        extensions: string[];
    };
};
export declare const createLibraryConfig: ({ entry, modeEnv, outputPath, webpackAliases, ...rest }: Props) => {
    entry: any;
    mode: "production" | "development" | undefined;
    module: {
        rules: {
            test: RegExp;
            use: (string | {
                loader: string;
                options: {
                    poolTimeout: number;
                    workers: number;
                };
            })[];
        }[];
    };
    output: {
        filename: string;
        path: string | undefined;
    };
    resolve: {
        alias: any;
        aliasFields: string[];
        extensions: string[];
    };
};
export declare const createScriptConfig: ({ entry, modeEnv, outputPath, webpackAliases, ...rest }?: Props) => {
    entry: any;
    mode: "production" | "development" | undefined;
    module: {
        rules: {
            test: RegExp;
            use: (string | {
                loader: string;
                options: {
                    poolTimeout: number;
                    workers: number;
                };
            })[];
        }[];
    };
    output: {
        clean: boolean;
        filename: string;
        path: string | undefined;
    };
    plugins: ((compiler: {
        hooks: {
            done: {
                tap: (action: string, callback: import("lkree-common-utils/ts").AnyFunction) => any;
            };
        };
    }) => any)[];
    resolve: {
        alias: any;
        aliasFields: string[];
        extensions: string[];
    };
};
export declare const createNodeLibraryConfig: (props: Props) => {
    entry: any;
    mode: "production" | "development" | undefined;
    module: {
        rules: {
            test: RegExp;
            use: (string | {
                loader: string;
                options: {
                    poolTimeout: number;
                    workers: number;
                };
            })[];
        }[];
    };
    output: {
        filename: string;
        path: string | undefined;
    };
    resolve: {
        alias: any;
        aliasFields: string[];
        extensions: string[];
    };
};
export declare const createNodeScriptConfig: (props: Props) => {
    entry: any;
    mode: "production" | "development" | undefined;
    module: {
        rules: {
            test: RegExp;
            use: (string | {
                loader: string;
                options: {
                    poolTimeout: number;
                    workers: number;
                };
            })[];
        }[];
    };
    output: {
        clean: boolean;
        filename: string;
        path: string | undefined;
    };
    plugins: ((compiler: {
        hooks: {
            done: {
                tap: (action: string, callback: import("lkree-common-utils/ts").AnyFunction) => any;
            };
        };
    }) => any)[];
    resolve: {
        alias: any;
        aliasFields: string[];
        extensions: string[];
    };
};
export {};
