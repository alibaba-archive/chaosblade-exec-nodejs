source `dirname $0`/build.sh
git add .
./node_modules/.bin/lerna publish $*
