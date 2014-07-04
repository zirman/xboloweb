FROM node:0.10

MAINTAINER robert.chrzanowski@gmail.com

# Bundle app source

ADD . /xbolo
WORKDIR /xbolo

# Networking

EXPOSE 8080

# Install app dependencies

RUN npm install
CMD ["npm", "start"]
