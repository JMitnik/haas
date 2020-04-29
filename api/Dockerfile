FROM mhart/alpine-node:13.12.0
ENV PORT 4000

WORKDIR /app
COPY ./package.json /app/
COPY ./ /app/

RUN apk update \
  && apk add curl python bash --no-cache --virtual build-dependencies build-base gcc \
  && yarn add prisma \
  && yarn

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT || exit 1

EXPOSE ${PORT}

CMD [ "bash", "docker-entrypoint.sh" ]
