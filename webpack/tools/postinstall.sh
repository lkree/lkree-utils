#!/usr/bin/env bash
if [ -d .git/hooks ]; then
    ln -sf `pwd`/githooks/* .git/hooks
fi
