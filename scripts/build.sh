#!/bin/bash

set -e

npm run authors

./node_modules/.bin/lerna run build

