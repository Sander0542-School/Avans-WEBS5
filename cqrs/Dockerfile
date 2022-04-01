FROM node:16-alpine

WORKDIR /usr/src/common
COPY common .

RUN npm ci --only=production

WORKDIR /usr/src/app
COPY cqrs/package*.json ./

RUN npm ci --only=production

COPY cqrs .

EXPOSE 80
CMD [ "npm", "start" ]
