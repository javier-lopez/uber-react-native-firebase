#!/bin/sh
set -xe

. ~/.android_rc

#connect to IP if specified
if [ -n "${_ADB_EMULATOR_IP_ADDRESS}" ]; then
    # Local version of ADB_EMULATOR_IP_ADDRESS with no whitespace
    export _ADB_EMULATOR_IP_ADDRESS=#{ENV['ADB_EMULATOR_IP_ADDRESS']}
    export _ADB_EMULATOR_IP_ADDRESS="$(printf "%s" "${_ADB_EMULATOR_IP_ADDRESS}" | tr -d '[[:space:]]')"
    adb connect "${_ADB_EMULATOR_IP_ADDRESS}"
    # Appears to need some time before the adb reverse command to correctly identify the device
    printf "%s\\n" "Waiting for adb connection to stabilize"
    sleep 5
fi

#open live-reload port
for time in 1 3 5 10 15 20 25 30 40 60; do
    adb reverse tcp:8081 tcp:8081 && break
    printf "%b\\n" "\007\c"
    printf "%s\\n" "Killing adb, and trying in ${time} seconds"
    printf "%s\\n" "Confirm the PC is authorized to connect to your device, unplug/plug your device if required"
    printf "%s\\n" "****************************************"
    adb kill-server
    sleep "${time}"
done

adb devices || :
