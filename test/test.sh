#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

./setup-tests.sh

cd $DIR

./run-tests.sh

cd $DIR

./clean-tests.sh
