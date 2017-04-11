#!/bin/sh
set -xe

command -v "react-native" >/dev/null 2>&1 || sudo yarn global add react-native-cli
command -v "flow" >/dev/null 2>&1         || sudo yarn global add flow
command -v "babel" >/dev/null 2>&1        || sudo yarn global add babel-cli

#https://github.com/yarnpkg/yarn/issues/1436
whoami="$(whoami)"
sudo chown -R ${whoami}:${whoami} ~/.yarn* ~/.cache/yarn/ || :
#https://github.com/yarnpkg/yarn/issues/2937
sudo chown -R ${whoami}:${whoami} /tmp/v8-compile-cache/  || :
