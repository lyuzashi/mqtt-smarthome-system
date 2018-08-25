#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
SDBOOT=/Volumes/boot

cp $SDBOOT/cmdline.txt $SDBOOT/cmdline.original.txt
curl -L -O https://github.com/BytemarkHosting/pi-init2/releases/download/v0.0.1/release.zip
unzip -q -o release.zip -x appliance/* -d $SDBOOT

cp -a $DIR/appliance /Volumes/boot

rm release.zip

