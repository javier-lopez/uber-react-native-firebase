#!/bin/sh
set -xe

rm -rf ~/.gitconfig

#remove history
cat /dev/null > ~/.bash_history
