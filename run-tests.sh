#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FALLBACK_CLI_FIXTURE_BASE=$DIR/test
FB=$FALLBACK_CLI_FIXTURE_BASE

cd $FB/module_a
EXPECT_SHIM=global EXPECT_CLI=a ../cli_module/cli-shim.js
cd $FB/module_a
EXPECT_SHIM=a EXPECT_CLI=a ./node_modules/cli_module/cli-shim.js

cd $FB/module_b
EXPECT_SHIM=global EXPECT_CLI=b ../cli_module/cli-shim.js
cd $FB/module_b
EXPECT_SHIM=b EXPECT_CLI=b ./node_modules/cli_module/cli-shim.js

cd $FB/module_c
EXPECT_SHIM=global EXPECT_CLI=global ../cli_module/cli-shim.js
