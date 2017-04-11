#!/bin/sh
set -xe

for dir in /home/vagrant/* /vagrant/*; do
    [ ! -d "${dir}" ] && continue
    [ ! -f "${dir}"/index.ios.js ] && continue
    [ ! -f "${dir}"/index.android.js ] && continue

    (
        cd "${dir}"
        #prevent http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc
        npm dedupe
        grep 'fs.inotify.max_user_watches=524288' /etc/sysctl.conf || \
            printf "%s\\n" 'fs.inotify.max_user_watches=524288' | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
    )
done
