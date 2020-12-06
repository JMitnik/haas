FROM node:14-alpine AS base

WORKDIR /usr/src

COPY package.json .

# Copy handy utility wait-for-it
COPY ./wait-for-it.sh ./
RUN ["chmod", "+x", "/usr/src/frontend/client/wait-for-it.sh"]

CMD [ "npx", "yarn", "start" ]