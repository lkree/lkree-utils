module.exports = {
    testEnvironment: 'jsdom',
    moduleDirectories: ['./node_modules', 'src'],
    moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
    moduleNameMapper: {
        '~/(.*)$': '<rootDir>/src/$1',
        'test/(.*)$': '<rootDir>/test/$1',
    },
    transform: {
        '^.+\\.(ts|js|tsx|jsx)$': ['babel-jest'],
        '^.+\\.(css|less)$': '<rootDir>/test/_settings/mocks/emptyMock.ts',
    },
    transformIgnorePatterns: [
      'node_modules/(?!lkree-common-utils)/'
    ],
    setupFilesAfterEnv: ['<rootDir>/test/_settings/setup/setupSettings.ts'],
    automock: false,
};
