#!/bin/sh

set -xe

if ! dpkg -l | grep vim-nox >/dev/null 2>&1; then
    sudo apt-get install --no-install-recommends -y vim-nox git
fi

rm -rf ~/.vimrc
wget --no-check-certificate -q \
    https://raw.githubusercontent.com/javier-lopez/dotfiles/master/.vimrc -O ~/.vimrc

if [ ! -d ~/.vim/bundle/vundle/.git/ ]; then
    git clone --depth=1 https://git::@github.com/javier-lopez/vundle.git ~/.vim/bundle/vundle/
else
    (cd ~/.vim/bundle/vundle/ && git pull || :)
fi

vim -es -u ~/.vimrc -c "BundleInstall" -c qa >/dev/null 2>&1 || :
