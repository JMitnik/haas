# Step 1: Setup the base of the image
FROM node:14-alpine AS base
ENV PORT 4000

RUN apk add --update openssl

WORKDIR /app

# Copy package and install production deps (these will be put later in final image)
COPY ./api/package.json ./api/tsconfig.json ./api/schema.prisma ./

RUN yarn install
RUN npx prisma generate

EXPOSE ${PORT}
EXPOSE 4000

ENV NODE_ENV=production

USER node
# Start development server (refreshes itself)
CMD [ "sh", "-c", "npx tsnd --exit-child --transpile-only -- ./src/app.ts" ]
