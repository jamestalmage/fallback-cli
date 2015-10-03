#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

./clean-tests.sh

cd $DIR

cp cli_module/cli-shim.js module_a/node_modules/cli_module
cp cli_module/cli-shim.js module_b/node_modules/cli_module
ln -s $DIR/.. cli_module/node_modules/fallback-cli
ln -s $DIR/.. module_a/node_modules/cli_module/node_modules/fallback-cli
ln -s $DIR/.. module_b/node_modules/cli_module/node_modules/fallback-cli
