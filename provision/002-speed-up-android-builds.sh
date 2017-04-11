#!/bin/sh
set -xe

[ -d ~/.gradle ] || mkdir ~/.gradle

#enable gradle daemon
grep 'org.gradle.daemon=true' ~/.gradle/gradle.properties >/dev/null 2>&1 || \
    printf "%s\\n" "org.gradle.daemon=true" >> ~/.gradle/gradle.properties

#enable parallel builds
grep 'org.gradle.parallel=true' ~/.gradle/gradle.properties >/dev/null 2>&1 || \
    printf "%s\\n" "org.gradle.parallel=true" >> ~/.gradle/gradle.properties
