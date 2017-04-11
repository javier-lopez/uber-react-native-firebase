#!/bin/sh

cat > ~/.welcome-msg <<'EOF'

-----------
Quick start
-----------

    $ cd ~/*native*
    $ react-native start & #react-native packager
    $ react-native run-android #or run-ios

Sometimes gradle success building the apk but fail to upload it to the device,
in such cases upload it manually:

    $ adb install "$(find ~/*native* -name "app-debug.apk")"
EOF

grep 'cat ~/.welcome-msg' ~/.bashrc >/dev/null 2>&1 || \
    printf "%s\\n" "cat ~/.welcome-msg" >> ~/.bashrc
