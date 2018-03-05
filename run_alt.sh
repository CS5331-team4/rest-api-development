#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

TEAMID=`md5sum README.md | cut -d' ' -f 1`
web="$TEAMID""web"
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
docker build mean-docker/mongo -t sonalshenoy
docker run -d --name mymongodb -p 27017:27017 -t sonalshenoy
docker build mean-docker/websec -t "$TEAMID""web"
docker run -d -p 80:80 -t "$TEAMID""web"
#sleep 20
docker build mean-docker/backend -t $TEAMID
docker run --link=mymongodb:sonalshenoy -p 8080:8080 -t $TEAMID
