import { getHTMLPath } from '~/shared/const';
import { createDeclarations, getDonePlugin, getHTMLPlugin } from '~/shared/lib/helpers';

type Configuration = Record<string, any>;

type Props = Partial<Configuration> & {
  modeEnv?: 'production' | 'development';
  outputPath?: string;
  webpackAliases?: NonNullable<Configuration['resolve']>['alias'];
};

export const createBaseConfig = ({ entry, modeEnv, outputPath, webpackAliases, ...rest }: Props) => ({
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

export const createLibraryConfig = ({ entry, modeEnv, outputPath, webpackAliases, ...rest }: Props) =>
  createBaseConfig({
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
    plugins: [createDeclarations({ filePath: Object.values(entry)[0] as string })],
    resolve: {
      alias: webpackAliases,
      aliasFields: ['browser'],
      extensions: ['.ts', '.js'],
    },
    webpackAliases,
    ...rest,
  });

export const createScriptConfig = ({ entry, modeEnv, outputPath, webpackAliases, ...rest }: Props = {}) =>
  createBaseConfig({
    entry,
    module: {
      rules: [
        {
          exclude: /node_modules/,
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

export const createNodeLibraryConfig = (props: Props) =>
  createLibraryConfig({
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

export const createNodeScriptConfig = (props: Props) =>
  createScriptConfig({
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

interface ReactScriptConfigProps extends Props {
  HTMLPath?: string;
}

export const createReactScriptConfig = ({
  entry,
  HTMLPath = getHTMLPath(),
  modeEnv,
  outputPath,
  webpackAliases,
  ...rest
}: ReactScriptConfigProps = {}) => {
  const isDevelopment = modeEnv === 'development';

  return createScriptConfig({
    devtool: modeEnv === 'development' ? 'eval-source-map' : undefined,
    entry,
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          use: [
            {
              loader: 'thread-loader',
              options: {
                poolTimeout: isDevelopment ? Number.POSITIVE_INFINITY : 500,
                workers: 2,
              },
            },
            'babel-loader',
          ],
        },
        {
          test: /\.sass$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.css/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        maxAsyncRequests: 20,
        maxInitialRequests: 20,
      },
    },
    output: {
      clean: true,
      filename: '[name].bundle.js',
      path: outputPath,
      publicPath: '/',
    },
    plugins: [getHTMLPlugin(HTMLPath)],
    resolve: {
      alias: webpackAliases,
      aliasFields: ['browser'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css', '.json', '.d.ts'],
    },
    ...rest,
  });
};
