#!/usr/bin/env bash

su - hal -c "cd /home/hal/mqtt-smarthome-system && \
git pull && \
yarn install --ignore-engines && \
node --experimental-modules main.mjs"
