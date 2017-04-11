#!/bin/sh
set -xe

if ! command -v "tmux" >/dev/null 2>&1; then
    sudo apt-get install --no-install-recommends -y tmux
fi

rm -rf ~/.tmux.conf
wget --no-check-certificate -q \
        https://raw.githubusercontent.com/javier-lopez/dotfiles/master/.tmux.conf -O ~/.tmux.conf

if [ ! -d ~/.tmux/plugins/tundle/.git/ ]; then
    git clone --depth=1 https://github.com/javier-lopez/tundle ~/.tmux/plugins/tundle
else
    (cd ~/.tmux/plugins/tundle && git pull || :)
fi

sh ~/.tmux/plugins/tundle/scripts/install_plugins.sh || :

#wget -q https://github.com/tmate-io/tmate/releases/download/2.2.1/tmate-2.2.1-static-linux-amd64.tar.gz -O /tmp/tmate.tar.gz
#(cd /tmp && tar zxvf /tmp/tmate.tar.gz)
#chmod +x /tmp/tmate-2.2.1-static-linux-amd64/tmate
#sudo mv  /tmp/tmate-2.2.1-static-linux-amd64/tmate /usr/bin/
