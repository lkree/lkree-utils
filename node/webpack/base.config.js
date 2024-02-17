module.exports = ({ modeEnv, entry, webpackAliases, outputPath, ...rest }) => ({
  entry,
    mode: modeEnv,
    resolve: {
        extensions: ['.ts', '.js'],
        aliasFields: ['browser'],
        alias: webpackAliases
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: 2,
                            poolTimeout: modeEnv === 'development' ? Number.POSITIVE_INFINITY : 500,
                        },
                    },
                    'babel-loader'
                ],
            },
        ]
    },
    experiments: {
        outputModule: true,
    },
    output: {
        library: {
            type: 'module',
        },
        chunkFormat: false,
        path: outputPath,
        filename: 'index.js',
        clean: true
    },
    externalsPresets: {
      node: true // in order to ignore built-in modules like path, fs, etc.
    },
  ...rest
});
