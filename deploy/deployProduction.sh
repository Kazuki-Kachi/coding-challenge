#!/bin/bash
script_dir=`cd $(dirname $0) && pwd`
pushd ${script_dir}

bash ../client/scripts/clientProduction.sh $@
bash ../server/scripts/apiProduction.sh $@