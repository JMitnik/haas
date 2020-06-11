FROM node:13 AS base
ENV PORT 4000

WORKDIR /app

from base as builder

COPY ./package.json schema.prisma ./

RUN apt-get update \
  && apt-get install curl python bash \
  && yarn add @prisma/cli@2.0.0-beta.3 \
  && yarn install

RUN npx prisma generate

from base

COPY --from=builder /app/node_modules ./node_modules
COPY ./ /app
EXPOSE ${PORT}

CMD [ "bash", "docker-entrypoint.sh" ]
