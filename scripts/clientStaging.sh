#!/bin/bash
script_dir=`cd $(dirname $0) && pwd`
pushd ${script_dir}

npm run deploy -- --bucket stage.annowork.com-staticpage --distribution-id E1GAAGS9AZ2G3S $@