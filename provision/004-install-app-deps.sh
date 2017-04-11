#!/bin/sh
set -xe

. ~/.android_rc

#setup offline cache
mkdir -p ~/npm-cache
yarn config set yarn-offline-mirror ~/npm-cache

for dir in /home/vagrant/* /vagrant/*; do
    [ ! -d "${dir}" ] && continue
    [ ! -f "${dir}"/index.ios.js ] && continue
    [ ! -f "${dir}"/index.android.js ] && continue

    (
        cd "${dir}"
        #download and install node app dependencies
        yarn

        #download and install android app dependencies
        cd android && ./gradlew dependencies
    )
done
