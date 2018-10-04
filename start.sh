#!/usr/bin/env bash

su - hal -c "cd /home/hal/mqtt-smarthome-system && \
git pull && \
yarn install --ignore-engines && \
authbind --deep yarn start"
