#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

rm -f $DIR/fallback-cli
rm -f test/cli_module/node_modules/fallback-cli
rm -f test/module_{a,b}/node_modules/cli_module/{cli-shim.js,package.json,node_modules/fallback-cli}
