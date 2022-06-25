#!/bin/bash
script_dir=`cd $(dirname $0) && pwd`
pushd ${script_dir}

bash ../client/scripts/clientDevelop.sh $@
bash ../server/scripts/apiDevelop.sh $@