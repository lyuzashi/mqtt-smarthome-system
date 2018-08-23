#!/usr/bin/env bash

# Download relase from https://github.com/BytemarkHosting/pi-init2
# Unzip and copy cmdline.txt and pi-ini2 

FILES="./pi-init2/cmdline.txt ./pi-init2/pi-init2 appliance"

cp /Volumes/boot/cmdline.txt /Volumes/boot/cmdline.original.txt && \
cp -a $FILES /Volumes/boot

