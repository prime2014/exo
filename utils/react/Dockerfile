FROM node:16.14.2

ENV DOCKER_BUILDKIT 1

WORKDIR /app

COPY ./app/package.json /app/


RUN npm install -g npm@8.19.2 \
    && npm install

COPY ./app/* /app/


