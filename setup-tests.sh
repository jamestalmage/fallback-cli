#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

./clean-tests.sh

cd $DIR

cp test/cli_module/{package.json,cli-shim.js} test/module_a/node_modules/cli_module
cp test/cli_module/{package.json,cli-shim.js} test/module_b/node_modules/cli_module
ln -s $DIR test/cli_module/node_modules/fallback-cli
ln -s $DIR test/module_a/node_modules/cli_module/node_modules/fallback-cli
ln -s $DIR test/module_b/node_modules/cli_module/node_modules/fallback-cli
