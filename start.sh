#!/usr/bin/env bash

cd /home/hal/mqtt-smarthome-system
git pull
npm install
node --experimental-modules main.mjs
