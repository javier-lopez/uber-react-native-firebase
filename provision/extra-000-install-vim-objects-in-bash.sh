#!/bin/sh
set -xe

rm -rf ~/.inputrc
wget --no-check-certificate -q \
    https://raw.githubusercontent.com/minos-org/bash-minos-settings/master/etc%23%23inputrc -O ~/.inputrc || :
