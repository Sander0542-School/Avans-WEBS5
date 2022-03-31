FROM node:16-alpine

WORKDIR /usr/src/common
COPY common .

RUN npm ci --only=production

WORKDIR /usr/src/app
COPY submission/package*.json ./

RUN npm ci --only=production

COPY submission .

EXPOSE 80
CMD [ "npm", "start" ]
