FROM node:16-alpine

WORKDIR /usr/src/common
COPY common .

RUN npm ci --only=production

WORKDIR /usr/src/app
COPY tagger/package*.json ./

RUN npm ci --only=production

COPY tagger .

CMD [ "npm", "start" ]
