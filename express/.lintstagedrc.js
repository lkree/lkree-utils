module.exports = {
    '*.{ts,tsx}': ['eslint --fix'],
    '*.{ts,tsx,d.ts}': () => "bash -c 'yarn ts-check'",
    'package.json': 'bash -c "yarn install --frozen-lockfile"',
};
