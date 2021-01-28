FROM node:12.18.0-alpine3.11 AS base
ENV PORT 4000

WORKDIR /app

RUN apk add bash yarn --update
RUN yarn add @prisma/cli@2.8.0

FROM base as builder

COPY ./package.json schema.prisma ./

RUN yarn install

FROM base

COPY --from=builder /app/node_modules ./node_modules
COPY ./ /app
EXPOSE ${PORT}

CMD [ "bash", "docker-entrypoint.sh" ]