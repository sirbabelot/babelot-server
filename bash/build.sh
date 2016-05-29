#!/bin/sh
Build () {
  compose="$1/docker-compose.yml"
  override="$1/docker-compose.override.yml"
  prod="$1/docker-compose.prod.yml"

  docker-compose -f $compose -f $override -f $prod build app &&
  docker-compose -f $compose -f $override -f $prod build nginx &&
  docker-compose -f $compose -f $override -f $prod build chatterpillar
}

if [ "$1" != "" ]; then
  Build $1
else
  echo "Usage: $0 <docker-compose-path>  "
  echo "\n* docker-compose-path: path to the docker-compose.yml"
fi
