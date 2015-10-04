#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FALLBACK_CLI_FIXTURE_BASE=$DIR

echo "**  module_a using global command  **"
cd $DIR/module_a
EXPECT_SHIM=global EXPECT_GLOBAL=global EXPECT_LOCAL=a EXPECT_LOCATION=local ../cli_module/cli-shim.js

echo "**  module_a using local (npm script) command  **"
cd $DIR/module_a
EXPECT_SHIM=a EXPECT_GLOBAL=null EXPECT_LOCAL=a EXPECT_LOCATION=local ./node_modules/cli_module/cli-shim.js

echo "**  module_b using global command  **"
cd $DIR/module_b
EXPECT_SHIM=global EXPECT_GLOBAL=global EXPECT_LOCAL=b EXPECT_LOCATION=local ../cli_module/cli-shim.js

echo "**  module_b using local (npm script) command  **"
cd $DIR/module_b
EXPECT_SHIM=b EXPECT_GLOBAL=null EXPECT_LOCAL=b EXPECT_LOCATION=local ./node_modules/cli_module/cli-shim.js

echo "**  module_c (no local install)  **"
cd $DIR/module_c
EXPECT_SHIM=global EXPECT_GLOBAL=global EXPECT_LOCAL=null EXPECT_LOCATION=global ../cli_module/cli-shim.js
