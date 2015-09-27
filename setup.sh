#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

./clean.sh

cd $DIR

cp test/fixture/cli_module/{package.json,cli-shim.js} test/fixture/module_a/node_modules/cli_module
cp test/fixture/cli_module/{package.json,cli-shim.js} test/fixture/module_b/node_modules/cli_module
ln -s $DIR test/fixture/cli_module/node_modules/fallback-cli
ln -s $DIR test/fixture/module_a/node_modules/cli_module/node_modules/fallback-cli
ln -s $DIR test/fixture/module_b/node_modules/cli_module/node_modules/fallback-cli
