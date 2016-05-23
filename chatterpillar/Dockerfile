# Dockerfile
FROM node:5.3.0

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/chatterpillar && cp -a /tmp/node_modules /usr/src/chatterpillar/

WORKDIR /usr/src/chatterpillar
COPY . /usr/src/chatterpillar
