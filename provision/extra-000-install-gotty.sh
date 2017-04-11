#!/bin/sh
set -xe

if [ ! -f /usr/bin/gotty ]; then
    if [ ! -f /tmp/gotty_linux_amd64.tar.gz ]; then
        wget --progress=bar:force \
            https://github.com/yudai/gotty/releases/download/v0.0.13/gotty_linux_amd64.tar.gz -O /tmp/gotty_linux_amd64.tar.gz
    fi
    sudo tar zxf /tmp/gotty_linux_amd64.tar.gz -C /usr/bin/
fi

if ! grep gotty ~/.bashrc >/dev/null 2>&1; then
    printf "%s\\n" "alias gotty.share.screen='gotty -p 8080 -c foobar:foobar -w tmux new -A -s foobar bash'" >> ~/.bashrc
fi
