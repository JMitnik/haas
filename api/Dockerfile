FROM node:14 AS base
ENV PORT 4000

WORKDIR /app

RUN apt-get update \
  && apt-get install curl python bash \
  && yarn install

FROM base as builder

COPY ./package.json schema.prisma ./

RUN npx prisma generate

FROM base

COPY --from=builder /app/node_modules ./node_modules
COPY ./ /app
EXPOSE ${PORT}

CMD [ "bash", "docker-entrypoint.sh" ]
