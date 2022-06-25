#!/bin/bash
script_dir=`cd $(dirname $0) && pwd`
pushd ${script_dir}

npm run deploy -- --bucket dev.annowork.com-staticpage --distribution-id E2NK1JPGXFIX3D $@