FROM mhart/alpine-node:13.12.0
ENV PORT 4000

WORKDIR /app
COPY ./package.json /app/
COPY ./ /app/

RUN apk update \
  && apk add curl python --no-cache --virtual build-dependencies build-base gcc \
  && yarn add prisma \
  && yarn \
  && yarn migrate

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/version || exit 1

EXPOSE ${PORT}
CMD [ "yarn", "start" ]
