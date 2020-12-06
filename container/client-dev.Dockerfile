FROM node:14-alpine AS base

WORKDIR /usr/src

COPY frontend/ui /usr/src/frontend/ui
COPY frontend/client /usr/src/frontend/client

COPY package.json .
RUN YARN_CACHE_FOLDER=/dev/shm/yarn_cache yarn install && yarn cache clean

WORKDIR /usr/src/frontend/client

# Copy handy utility wait-for-it
COPY ./wait-for-it.sh ./
RUN ["chmod", "+x", "/usr/src/frontend/client/wait-for-it.sh"]

CMD [ "npx", "yarn", "start" ]