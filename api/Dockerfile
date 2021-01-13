# Step 1: Setup the base of the image
FROM node:14-alpine AS base
ENV PORT 4000

RUN apk add --update openssl

WORKDIR /app

# Step 2: Start building "all" dependencies
FROM base as prodBuilder

# Copy package and install production deps (these will be put later in final image)
COPY ./package.json tsconfig.json schema.prisma ./

# Install production only node_modules
RUN yarn install --production

# Put these "production node-modules" in temporary spot, as this will be overwritten soon
RUN cp -RL /app/node_modules /tmp/node_modules

# Delete cli from node-modules.
# TODO: Find out why this is even copied in the first place
RUN rm -rf /tmp/node_modules/@prisma/cli

# Step 2b: Build and generate all intermediate dependencies such as prisma, etc
RUN yarn install
RUN npx prisma generate

# Copy all source files to app
COPY ./src/ ./src/

# Build the actual app now (instead of ts-node)
RUN npx tsc -p ./tsconfig.json --outDir dist

# Put the schema.graphql in the dist as well
COPY ./src/generated/schema.graphql ./dist/generated/schema.graphql

# Step 3: Prep for production
FROM base

# Copy all temporary placed folders
# Copy 1: copy all "production node-modules"
COPY --from=prodBuilder /tmp/node_modules ./node_modules

# Copy 2: copy all built dependencies (such as prisma)
COPY --from=prodBuilder /app/node_modules/.prisma/client ./node_modules/.prisma/.client
# Copy 3: copy the built node app.
COPY --from=prodBuilder /app/dist ./dist

EXPOSE ${PORT}
EXPOSE 4000

ENV NODE_ENV=production

# Copy handy utility wait-for-it
COPY ./wait-for-it.sh ./
RUN ["chmod", "+x", "/app/wait-for-it.sh"]

USER node

CMD [ "node", "dist/app.js" ]