# Dockerfile
FROM node:5.3.0

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/chatbot && cp -a /tmp/node_modules /usr/src/chatbot/

WORKDIR /usr/src/chatbot
COPY . /usr/src/chatbot
