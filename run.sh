#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

TEAMID=`md5sum README.md | cut -d' ' -f 1`
web="$TEAMID""web"
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
cd mean-docker/websec
docker build -t websec:dev .
# docker run -d --name websec -p 80:80 websec:dev
cd ../backend
docker build -t backend:dev .
# docker run -d --name backend -p 8080:8080 backend:dev
# docker run -d --name mongodb -p 27017:27017 mongo
apt-get install docker-compose
cd ..
docker-compose up --build
