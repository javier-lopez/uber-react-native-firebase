#!/bin/sh
set -xe

#ensure vagrant user owns everything in sensible directories
[ -d /vagrant ]      && sudo chown -R vagrant:vagrant /vagrant
whoami="$(whoami)"
sudo chown -R "${whoami}":"${whoami}" ~
