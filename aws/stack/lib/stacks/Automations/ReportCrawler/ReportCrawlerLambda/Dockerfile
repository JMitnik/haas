FROM amazon/aws-lambda-nodejs:12 as node

# Allow AWS credentials to be supplied when building this container locally for testing, so S3 can be tested
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION=eu-central-1

# Set env variables to arguments
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  AWS_REGION=$AWS_REGION

# Install Chrome to get all of the dependencies installed
RUN yum install -y amazon-linux-extras
RUN amazon-linux-extras install epel -y
RUN yum install -y chromium

# Copy local dependencies
COPY jest.config.js package*.json tsconfig.json ${LAMBDA_TASK_ROOT}/
COPY bin/* ${LAMBDA_TASK_ROOT}/bin/
COPY test/app.test.ts ${LAMBDA_TASK_ROOT}/test/

# Build our app out
RUN npm install
RUN npm run build

CMD [ "bin/app.lambdaHandler" ]
