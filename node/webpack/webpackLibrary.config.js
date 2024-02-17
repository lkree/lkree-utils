const constantsGroup = require('./const')({ outputDirName: 'build' });
const { createDeclarations } = require('./utils');
const createBaseConfig = require('./base.config');

const modeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = constantsGroup.map(({ rootPath, globalOutputPath, ...constants }) =>
  createBaseConfig({
    ...constants,
    modeEnv,
    plugins: [
      createDeclarations(Object.values(constants.entry)[0], rootPath)
    ]
}));
