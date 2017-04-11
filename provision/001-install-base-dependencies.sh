#!/bin/sh
set -xe

_last_apt_get_update() {
    [ -z "${1}" ] && cache_seconds="3600" || cache_seconds="${1}"
    cache_file="/var/cache/apt/pkgcache.bin"
    if [ -f "${cache_file}" ]; then
        last="$(stat -c %Y "${cache_file}")"
        now="$(date +'%s')"
        diff="$(($now - $last))"
        if [ "${diff}" -lt "${cache_seconds}" ]; then
            return 1
        else
            return 0
        fi
    else
        return 0
    fi
}

#enable google repository and download chrome developer console
if [ ! -f /etc/apt/sources.list.d/google-chrome.list ]; then
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub      | sudo apt-key add -
    printf "%s\\n" "deb http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    _require_apt_get_update="1"
fi

if [ ! -f /etc/apt/sources.list.d/npm.list ]; then
    wget --quiet -O - https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
    VERSION="node_7.x"
    DISTRO="$(lsb_release -s -c)"
    printf "%s\\n" "deb https://deb.nodesource.com/${VERSION} ${DISTRO} main" | sudo tee /etc/apt/sources.list.d/npm.list
    _require_apt_get_update="1"
fi

if [ ! -f /etc/apt/sources.list.d/yarn.list ]; then
    wget --quiet -O - https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    printf "%s\\n" "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    _require_apt_get_update="1"
fi

if ! command -v "watchman" >/dev/null 2>&1; then
    if ! command -v "add-apt-repository"  >/dev/null 2>&1; then
        sudo apt-get install software-properties-common
    fi
    sudo add-apt-repository ppa:mwhiteley/watchman-daily
    _require_apt_get_update="1"
    #git clone https://github.com/facebook/watchman.git
    #cd watchman
    #./autogen.sh
    #./configure
    #make
    #sudo make install
fi

if ! command -v "java" >/dev/null 2>&1; then
    if ! command -v "add-apt-repository"  >/dev/null 2>&1; then
        sudo apt-get install software-properties-common
    fi
    sudo add-apt-repository ppa:webupd8team/java -y
    printf "%s\\n" 'oracle-java8-installer shared/accepted-oracle-license-v1-1 select true' | \
        sudo /usr/bin/debconf-set-selections
    _require_apt_get_update="1"
fi

if [ X"${_require_apt_get_update}" = X"1" ] || _last_apt_get_update 86400; then
    sudo apt-get update
fi

dpkg -l | grep squid-deb-proxy-client >/dev/null 2>&1 || \
    sudo apt-get install --no-install-recommends -y squid-deb-proxy-client

#install them everytime to ensure updates
sudo apt-get install --no-install-recommends -y \
     ant                    \
     autoconf               \
     automake               \
     expect                 \
     git                    \
     google-chrome-stable   \
     htop                   \
     lib32stdc++6           \
     lib32z1                \
     oracle-java8-installer \
     python-dev             \
     nodejs                 \
     watchman               \
     yarn

command -v "n" >/dev/null 2>&1 || sudo npm install -g n
sudo n stable
#sudo npm install -g yarn
sudo yarn self-update || :
