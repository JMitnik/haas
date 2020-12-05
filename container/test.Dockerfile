# Step 1: Setup the base of the image
FROM node:14-alpine AS base
ENV PORT 4000

RUN apk add --update openssl

WORKDIR /app

# Step 2: Start building "all" dependencies
FROM base as prodBuilder

# Copy package and install production deps (these will be put later in final image)
COPY ./api/package.json ./api/tsconfig.json ./api/schema.prisma ./api/migrations ./

# Install production only node_modules
RUN yarn install --production

# Put these "production node-modules" in temporary spot, as this will be overwritten soon
RUN cp -RL /app/node_modules /tmp/node_modules

# Step 2b: Build and generate all intermediate dependencies such as prisma, etc
RUN yarn install
RUN npx prisma generate

# Copy all source files to app
COPY ./api/src/ ./src/

# Build the actual app now (instead of ts-node)
RUN npx tsc -p ./tsconfig.json --outDir dist

# Put the schema.graphql in the dist as well
COPY ./api/src/generated/schema.graphql ./dist/generated/schema.graphql

# Step 3: Prep for production
FROM base

# Copy all temporary placed folders
# Copy 1: copy all "production node-modules"
# COPY --from=prodBuilder /tmp/node_modules ./node_modules

# Copy 2: copy all built dependencies (such as prisma)
COPY --from=prodBuilder /app/node_modules ./node_modules/
# Copy 3: copy the built node app.
COPY --from=prodBuilder /app/dist ./dist
COPY ./api/schema.prisma ./
COPY ./api/migrations ./migrations

COPY --from=prodBuilder /app/package.json .

EXPOSE ${PORT}
EXPOSE 4000

ENV NODE_ENV=production

USER node

CMD [ "node", "dist/app.js" ]
