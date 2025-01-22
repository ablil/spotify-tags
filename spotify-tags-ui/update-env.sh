#!/bin/bash

set -e

envs=(production development preview)
env_file='.env'
test -f $env_file

for key_value in `cat $env_file`; do
    key=$(echo $key_value | cut -f 1 -d '=')
    value=$(echo $key_value | cut -f 2 -d '=')

    for env in ${envs[@]}; do
        echo $value | vercel env add $key $env --force
    done
done
