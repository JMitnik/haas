FROM node:13 AS base
ENV PORT 4000

WORKDIR /app
COPY ./package.json /app/
COPY ./ /app/

RUN apt-get update \
  && apt-get add curl python bash \
  && yarn add prisma \
  && yarn

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT || exit 1

EXPOSE ${PORT}

CMD [ "bash", "docker-entrypoint.sh" ]
