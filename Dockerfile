# Dockerfile
FROM node:5

# Create app directory
RUN mkdir -p /usr/src/app
RUN npm i -g nodemon
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN npm i

EXPOSE 3443

CMD [ "npm", "start" ]
