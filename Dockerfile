FROM node:20-alpine

USER root

RUN apk update
RUN apk add
RUN apk add ffmpeg

WORKDIR /usr/src/app
# COPY . .
COPY ./package.json ./
COPY ./yarn.lock ./

# RUN yarn cache clean
RUN npm install --production
RUN npm install --cpu=x64 --os=linux sharp

COPY ./build ./build
COPY ./public ./public
COPY ./.env.* ./
COPY ./query ./query

EXPOSE 80
CMD ["node", "build/src/server.js"]