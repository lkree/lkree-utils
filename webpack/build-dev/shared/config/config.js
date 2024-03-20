import { createDeclarations, getDonePlugin } from '../../shared/lib/helpers/index.js';
export const createBaseConfig = ({ entry, modeEnv, outputPath, webpackAliases, ...rest }) => ({
    entry,
    mode: modeEnv,
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            poolTimeout: modeEnv === 'development' ? Number.POSITIVE_INFINITY : 500,
                            workers: 1,
                        },
                    },
                    'babel-loader',
                ],
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: outputPath,
    },
    resolve: {
        alias: webpackAliases,
        aliasFields: ['browser'],
        extensions: ['.ts', '.js'],
    },
    ...rest,
});
export const createLibraryConfig = ({ entry, modeEnv, outputPath, webpackAliases, ...rest }) => createBaseConfig({
    ...rest,
    entry,
    experiments: {
        outputModule: true,
    },
    modeEnv,
    output: {
        chunkFormat: 'module',
        filename: 'index.js',
        library: {
            type: 'module',
        },
        path: outputPath,
    },
    outputPath,
    plugins: [createDeclarations({ filePath: Object.values(entry)[0] })],
    resolve: {
        alias: webpackAliases,
        aliasFields: ['browser'],
        extensions: ['.ts', '.js'],
    },
    webpackAliases,
    ...rest,
});
export const createScriptConfig = ({ entry, modeEnv, outputPath, webpackAliases, ...rest } = {}) => ({
    entry,
    mode: modeEnv,
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            poolTimeout: modeEnv === 'development' ? Number.POSITIVE_INFINITY : 500,
                            workers: 2,
                        },
                    },
                    'babel-loader',
                ],
            },
        ],
    },
    output: {
        clean: true,
        filename: 'index.js',
        path: outputPath,
    },
    plugins: [getDonePlugin()],
    resolve: {
        alias: webpackAliases,
        aliasFields: ['browser'],
        extensions: ['.ts', '.js'],
    },
    ...rest,
});
export const createNodeLibraryConfig = (props) => createLibraryConfig({
    ...props,
    externalsPresets: {
        node: true,
    },
    resolve: {
        alias: props.webpackAliases,
        extensions: ['.ts', '.js'],
    },
    target: 'node',
});
export const createNodeScriptConfig = (props) => createScriptConfig({
    ...props,
    externalsPresets: {
        node: true,
    },
    resolve: {
        alias: props.webpackAliases,
        extensions: ['.ts', '.js'],
    },
    target: 'node',
});
