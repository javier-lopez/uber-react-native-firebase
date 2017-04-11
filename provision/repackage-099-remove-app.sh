#!/bin/sh
set -xe

#remove app, it's copied from the host machine on every `vagrant up`
rm -rf ~/*react-native*
