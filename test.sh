#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR

./setup.sh

cd $DIR

./run-tests.sh

cd $DIR

./clean.sh
