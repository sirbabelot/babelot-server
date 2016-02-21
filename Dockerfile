# Dockerfile
FROM node:5

# Create app directory
RUN mkdir -p /usr/src/app
RUN npm i -g nodemon
RUN npm install -g node-inspector

WORKDIR /usr/src/app

# Bundle app source
COPY ./app /usr/src/app

RUN npm i

EXPOSE 3443

CMD [ "npm", "start" ]
