#!/bin/sh
set -xe

rm -rf /tmp/android*.tgz
sudo apt-get clean
sudo dd if=/dev/zero of=/EMPTY bs=1M || :
sudo rm -f /EMPTY
