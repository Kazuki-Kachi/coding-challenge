#!/bin/bash
script_dir=`cd $(dirname $0) && pwd`
pushd ${script_dir}

bash ../client/scripts/clientStaging.sh $@
bash ../server/scripts/apiStaging.sh $@