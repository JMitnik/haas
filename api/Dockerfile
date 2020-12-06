# OLD DOCKERFILE
FROM node:14 AS base
ENV PORT 4000

WORKDIR /app

from base as builder

COPY ./package.json schema.prisma ./

RUN apt-get update \
  && apt-get install curl python bash \
  && yarn install

RUN npx prisma generate
RUN git clone https://github.com/vishnubob/wait-for-it.git

from base

COPY --from=builder /app/node_modules ./node_modules
COPY ./ /app
EXPOSE ${PORT}

CMD [ "bash", "docker-entrypoint.sh" ]
