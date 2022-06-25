#!/bin/bash
script_dir=`cd $(dirname $0) && pwd`
pushd ${script_dir}

npm run deploy -- --production --bucket annowork.com-staticpage --distribution-id E2RLBHH3I08NID $@