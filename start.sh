#!/usr/bin/env bash

su - hal -c "\
export NODE_ENV=production
cd /home/hal/mqtt-smarthome-system && \
git pull && \
yarn install --ignore-engines && \
yarn start
"
