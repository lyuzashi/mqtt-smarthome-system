#!/usr/bin/env bash

su - hal -c "cd /home/hal/mqtt-smarthome-system && \
git pull && \
yarn && \
node --experimental-modules main.mjs"
