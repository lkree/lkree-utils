const {outputPath, entry, webpackAliases, rootPath} = require('./const')({outputDirName: 'build'});
const {createDeclarations} = require('./utils');

const modeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  entry,
  mode: modeEnv,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    aliasFields: ['browser'],
    alias: webpackAliases
  },
  devtool: 'source-map',
  externals: [
    { 'react': 'react' },
    ({context, request}, callback) => {
      if (/lkree-common-utils/.test(request)) {
        // Externalize to a commonjs module using the request path
        return callback(null, 'module ' + request);
      }

      // Continue without externalizing the import
      callback();
    },
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
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
    path: outputPath,
    filename: '[name].js',
    chunkFormat: 'module',
    clean: true
  },
  plugins: [...createDeclarations(entry, rootPath)],
};
