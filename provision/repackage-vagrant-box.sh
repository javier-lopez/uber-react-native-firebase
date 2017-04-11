#!/bin/sh
set -xe

CURRENT_DIR="$(cd "$(dirname "${0}")" && pwd)"
BASE_PATH="$(cd "${CURRENT_DIR}"/../  && pwd)"
ORIG_VM_NAME="$(awk '/#base-image/{print $(NF-1)}' "${CURRENT_DIR}"/../Vagrantfile | awk -F'/' '{gsub(/"/,"");print $2}')"
MODIFIED_VM_NAME="${ORIG_VM_NAME}-$(basename "${BASE_PATH}")"

test -n "${MODIFIED_VM_NAME}" #verify variable actually contains data

cp   "${CURRENT_DIR}"/../Vagrantfile "${CURRENT_DIR}"/../Vagrantfile.bk
trap 'mv "${CURRENT_DIR}"/../Vagrantfile.bk  "${CURRENT_DIR}"/../Vagrantfile' INT TERM HUP EXIT

#disable custom ssh rule to allow `vagrant ssh -c` commands
sed -i '/guest: 22/d'                                                              "${CURRENT_DIR}"/../Vagrantfile

#use original base-image to build upon
sed -i 's:#\(machine.vm.box = .*\) #base-image$:\1 #base-image:'                   "${CURRENT_DIR}"/../Vagrantfile
sed -i 's:\(machine.vm.box = .*\) #modified-base-image$:#\1 #modified-base-image:' "${CURRENT_DIR}"/../Vagrantfile

(
cd "${CURRENT_DIR}" && cd ..
vagrant up
vagrant ssh -c '
for dir in /home/vagrant/* /vagrant/*; do
    [ ! -d "${dir}" ] && continue
    [ ! -f "${dir}"/index.ios.js ] && continue
    [ ! -f "${dir}"/index.android.js ] && continue
    for script in "${dir}"/provision/repackage-0*.sh; do "${script}"; done
done'
vagrant package --output "${MODIFIED_VM_NAME}".box
)

printf "%s\\n" "Image '${BASE_PATH}/${MODIFIED_VM_NAME}.box' created sucessfully!"
#upload image to https://atlas.hashicorp.com
