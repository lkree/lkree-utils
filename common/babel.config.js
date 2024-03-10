export default {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                useBuiltIns: 'entry',
                corejs: '3.1.3',
                exclude: [
                    'es.weak-map',
                    'es.weak-set',
                    'es.array-buffer.*',
                    'es.data-view',
                    'es.typed-array.*',
                    'es.reflect.*',
                ],
            },
        ],
        [
            "@babel/preset-typescript",
            {
                "allExtensions": true,
                "optimizeConstEnums": true
            }
        ],
    ],
    plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-syntax-dynamic-import',
    ],
    env: {
        test: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
        },
    },
};
