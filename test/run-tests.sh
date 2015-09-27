#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FALLBACK_CLI_FIXTURE_BASE=$DIR

echo "**  module_a using global command  **"
cd $DIR/module_a
EXPECT_SHIM=global EXPECT_CLI=a ../cli_module/cli-shim.js

echo "**  module_a using local (npm script) command  **"
cd $DIR/module_a
EXPECT_SHIM=a EXPECT_CLI=a ./node_modules/cli_module/cli-shim.js

echo "**  module_b using global command  **"
cd $DIR/module_b
EXPECT_SHIM=global EXPECT_CLI=b ../cli_module/cli-shim.js

echo "**  module_b using local (npm script) command  **"
cd $DIR/module_b
EXPECT_SHIM=b EXPECT_CLI=b ./node_modules/cli_module/cli-shim.js

echo "**  module_c (no local install)  **"
cd $DIR/module_c
EXPECT_SHIM=global EXPECT_CLI=global ../cli_module/cli-shim.js
