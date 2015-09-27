#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

cd test/fixture/module_a && ../cli_module/cli-shim.js && ./node_modules/cli_module/cli-shim.js
cd ../module_b && ../cli_module/cli-shim.js && ./node_modules/cli_module/cli-shim.js
cd ../module_c && ../cli_module/cli-shim.js
