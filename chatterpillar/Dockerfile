# Dockerfile
FROM node:5.3.0

COPY ./src/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

WORKDIR /usr/src/app
COPY ./src /usr/src/app
