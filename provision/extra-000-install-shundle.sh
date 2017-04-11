#!/bin/sh
set -xe

if [ ! -f ~/.shundle.rc ]; then
    cat > ~/.shundle.rc <<'EOF'
if [ -f ~/.shundle/bundle/shundle/shundle ]; then
    .  ~/.shundle/bundle/shundle/shundle
    Bundle='javier-lopez/shundle'
        #SHUNDLE_ENV_VERBOSE="0"
        #SHUNDLE_ENV_DEBUG="0"
        SHUNDLE_ENV_COLOR="1"
    #Bundle='javier-lopez/shundle-plugins/todo-rememberator'
        #REMEMBERATOR_EVERY="5"
    Bundle="gh:javier-lopez/shundle-plugins/eternalize"
        ETERNALIZE_PATH="${HOME}/.eternalize-data"
    Bundle="github:javier-lopez/shundle-plugins/colorize"
        COLORIZE_THEME="default-dark"
        COLORIZE_PS="yujie"
        COLORIZE_UTILS="sky"
    Bundle="javier-lopez/shundle-plugins/aliazator.git"
        #ALIAZATOR_PLUGINS="none"
        #ALIAZATOR_PLUGINS="minimal"
        ALIAZATOR_PLUGINS="installed"
        #ALIAZATOR_PLUGINS="all"
        #ALIAZATOR_PLUGINS="custom:minimal,git,apt-get,vagrant,vim"
        #ALIAZATOR_CLOUD="url"
    Bundle="gh:javier-lopez/shundle-plugins/autocd"
        #AUTOCD_FILE="/tmp/autocd.59YlpZ50"
else
    alias shundle-install='git clone --depth=1 \
    https://github.com/javier-lopez/shundle ~/.shundle/bundle/shundle && \
    . ~/.bashrc && ~/.shundle/bundle/shundle/bin/shundle install   && \
    bash'
fi
EOF
fi

if [ ! -d ~/.shundle/bundle/shundle/.git/ ]; then
    git clone --depth=1 https://github.com/javier-lopez/shundle ~/.shundle/bundle/shundle
else
    (cd ~/.shundle/bundle/shundle/ && git pull || :)
fi

SHUNDLE_HOME=~/.shundle SHUNDLE_RC=~/.shundle.rc ~/.shundle/bundle/shundle/bin/shundle install || :
grep '~/.shundle.rc' ~/.bashrc >/dev/null 2>&1 || printf "%s\\n" ". ~/.shundle.rc" >> ~/.bashrc
