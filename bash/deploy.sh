#!/bin/sh
Deploy () {
  compose="$1/docker-compose.yml"
  prod="$1/docker-compose.prod.yml"
  docker-compose -f $compose -f $prod stop &&
  yes | docker-compose -f $compose -f $prod rm --all &&
  docker-compose -f $compose -f $prod pull &&
  docker-compose -f $compose -f $prod up -d
}

if [ "$1" != "" ]; then
  Deploy $1
else
  echo "Usage: $0 <docker-compose-path>  "
  echo "\n* docker-compose-path: path to the docker-compose.yml"
fi
