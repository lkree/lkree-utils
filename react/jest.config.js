module.exports = {
    moduleDirectories: ['./node_modules', 'src'],
    moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx'],
    moduleNameMapper: {
        '~/(.*)$': '<rootDir>/src/$1',
        'test/(.*)$': '<rootDir>/test/$1',
    },
    transform: {
        '^.+\\.(ts|js|tsx|jsx)$': ['ts-jest']
    },
    automock: false,
};
