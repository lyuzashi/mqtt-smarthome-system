#!/usr/bin/env bash

export GOPATH=`pwd`/pi-init2
export GOOS=linux
export GOARCH=arm

go get golang.org/x/sys/unix

FILES="./pi-init2/cmdline.txt ./pi-init2/pi-init2 appliance"

go build -o pi-init2/pi-init2 ./pi-init2/src/projects.bytemark.co.uk/pi-init2 && \
  cp /Volumes/boot/cmdline.txt /Volumes/boot/cmdline.original.txt && \
  cp -a $FILES /Volumes/boot

