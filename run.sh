#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

TEAMID=`md5sum README.md | cut -d' ' -f 1`
web="$TEAMID""web"
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
docker build mean-docker/websec -t "$TEAMID""web"
docker run -d -p 80:80 -t "$TEAMID""web"
docker build mean-docker/mongo -t "$TEAMID""mon"
docker run -d -p 27017:27017 -t "$TEAMID""mon"
docker build mean-docker/backend -t $TEAMID
docker run -p 8080:8080 -t $TEAMID
