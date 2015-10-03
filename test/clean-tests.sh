#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

rm -f cli_module/node_modules/fallback-cli
rm -f module_{a,b}/node_modules/cli_module/{cli-shim.js,node_modules/fallback-cli}
