FROM node:16-alpine

WORKDIR /usr/src/common
COPY common .

RUN npm ci --only=production

WORKDIR /usr/src/app
COPY target/package*.json ./

RUN npm ci --only=production

COPY target .

EXPOSE 3000
CMD [ "npm", "start" ]
