#!/usr/bin/env bash

yarn install --frozen-lockfile --ignore-optional
if [ $? != 0 ]; then
    exit 1
fi
if [ "$1" != "--skip-tests" ]; then
    yarn ts-check && yarn eslint-test
    if [ $? != 0 ]; then
        exit 1
    fi
fi

rm -rf build &&
cross-env NODE_ENV=production webpack &&
node ./tools/rewritePackageJson.js
