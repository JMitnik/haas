import { Context } from 'aws-lambda';
import * as aws from 'aws-sdk';
import * as puppeteer from 'puppeteer';
import axios from 'axios';

const authenticateLambda = async (apiUrl: string, authenticateEmail: string, workspaceEmail: string, authorizationHeader: string) => {
  return axios.post(apiUrl, {
    query: `
    mutation authenticateLambda($input: AuthenticateLambdaInput) {
      authenticateLambda(input: $input)
    }`,
    operationName: "authenticateLambda",
    variables: {
      input: { "authenticateEmail": authenticateEmail, "workspaceEmail": workspaceEmail }
    }
  }, {
    headers: {
      lambda: authorizationHeader,
    },
  })
    .then(function (response) {
      console.log('RESPONSE: ', response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log('ERROR AXIOS', error);
    });
}

const verifyToken = async (apiUrl: string, token: string) => {
  return axios.post(apiUrl, {
    query: `
    mutation verifyUserToken($token: String!) {
      verifyUserToken(token: $token) {
        accessToken
        userData {
          email
        }
      }
    }`,
    operationName: "verifyUserToken",
    variables: {
      token: token,
    }
  })
    .then(function (response) {
      console.log('verifyToken RESPONSE: ', response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log('ERROR AXIOS', error);
    });
}

const getCustomerData = async (apiUrl: string, customerSlug: string, userId: string, bearerToken: string) => {
  return axios.post(apiUrl, {
    query: `
    query getCustomerOfUser($input: UserOfCustomerInput) {
      UserOfCustomer(input: $input) {
        customer {
          id
          name
          slug
          settings {
            id
            logoUrl
            colourSettings {
              id
              primary
            }
          }
          campaigns {
            id
            label
          }
        }
        role {
          name
          permissions
        }
        user {
          id
          assignedDialogues(input: $input) {
            privateWorkspaceDialogues {
              title
              slug
              id
            }
            assignedDialogues {
              slug
              id
            }
          }
        }
      }
    }
    `,
    operationName: "getCustomerOfUser",
    variables: {
      input: {
        "customerSlug": customerSlug,
        "userId": userId
      }
    }
  }, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  })
    .then(function (response) {
      console.log('RESPONSE: ', response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log('ERROR AXIOS', error);
    });
}

export const lambdaHandler = async (event: any, context: Context) => {
  const url = event.url;
  console.log(`URL: ${url}`);
  console.log('ENV: ', process.env);

  console.log('EVENT: ', event.Records?.[0]?.Sns.Message, 'Type: ', typeof event.Records?.[0]?.Sns.Message);
  const message = JSON.parse(event.Records?.[0]?.Sns.Message)
  const apiUrl: string = message.API_URL;
  const dashboardUrl: string = message.DASHBOARD_URL;
  const authenticateEmail: string = message.AUTHENTICATE_EMAIL;
  const workspaceEmail: string = message.WORKSPACE_EMAIL;
  const reportUrl: string = message.REPORT_URL;
  const workspaceSlug: string = message.WORKSPACE_SLUG;
  const botUserId: string = message.USER_ID;

  const authorizationKey: string = process.env.AUTOMATION_API_KEY;

  if (!reportUrl) return {
    statusCode: 400,
    body: 'Error: No report url available!'
  };

  if (!apiUrl) return {
    statusCode: 400,
    body: 'Error: No api url available!'
  };

  if (!authorizationKey) return {
    statusCode: 400,
    body: 'Error: No authorization api key available!'
  };

  if (!dashboardUrl) return {
    statusCode: 400,
    body: 'Error: No dashboard url available!'
  };

  const result = await authenticateLambda(apiUrl, authenticateEmail, workspaceEmail, authorizationKey);
  console.log('result: ', result?.data);
  const token = result?.data.authenticateLambda;
  const verifyTokenMutation = await verifyToken(apiUrl, token);
  const accessToken = verifyTokenMutation?.data?.verifyUserToken?.accessToken;
  console.log('Access token: ', accessToken);

  if (!token) return {
    statusCode: 400,
    body: 'Error: No authenticate token for provided workspace email available!'
  }

  const customerResult = await getCustomerData(apiUrl, workspaceSlug, botUserId, accessToken);
  const customer = customerResult.data.UserOfCustomer?.customer;
  const role = customerResult.data.UserOfCustomer?.role;
  const newUser = customerResult.data.UserOfCustomer?.user;

  const customerLocalStorage = {
    ...customer,
    user: newUser,
    userRole: role,
  }

  console.log('Customer Local Storage: ', customerLocalStorage);

  let attempt = 0;
  do {
    attempt++;
    try {
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--single-process'
        ]
      });
      const browserVersion = await browser.version()

      console.log(`Started ${browserVersion}`);

      // const result = await authenticateLambda(apiUrl, authenticateEmail, workspaceEmail, authorizationKey);
      // const token = result?.data.authenticateLambda;
      // const verifyTokenMutation = await verifyToken(apiUrl, token);

      console.log('Access Token: ', verifyTokenMutation?.data?.verifyUserToken?.accessToken);
      const accessToken = verifyTokenMutation?.data?.verifyUserToken?.accessToken;
      const bearerToken = `Bearer:${accessToken}`

      console.log('Bearer token: ', bearerToken);

      const page = await browser.newPage();

      page.on("pageerror", function (err) {
        const theTempValue = err.toString();
        console.log("Page error: " + theTempValue);
      });

      page.on("error", function (err) {
        const theTempValue = err.toString();
        console.log("Error: " + theTempValue);
      });

      // await page.setExtraHTTPHeaders(headers);
      await page.setViewport({ width: 1920, height: 1080 });

      console.log('Going to: ', reportUrl);
      await page.goto(reportUrl, { waitUntil: 'networkidle0' });
      console.log('Access token before evaluate: ', accessToken);

      await page.evaluateOnNewDocument(
        (token, customer) => {
          localStorage.clear();
          localStorage.setItem('access_token', token);
          localStorage.setItem('customer', JSON.stringify(customer));
        }, accessToken, customerLocalStorage);

      await page.goto(reportUrl, { waitUntil: ['networkidle0', 'domcontentloaded'], });
      const localStorageFourth = await page.evaluate(() => JSON.stringify(Object.assign({}, window.localStorage)));
      console.log('New page storage: ', localStorageFourth)

      // TODO: Find a better way to wait for page to load
      await page.waitForTimeout(10000);

      const pdf = await page.pdf({ format: 'A4' }) as Buffer;
      await page.close();
      await browser.close();

      const s3 = new aws.S3();
      const key = `screenshots/${context.awsRequestId}.pdf`;
      console.log(`Screenshot location: ${process.env.bucketName}/${key}`);
      await s3.putObject({
        Bucket: process.env.bucketName,
        Key: key,
        Body: pdf,
        ContentType: 'image'
      }).promise();

      return {
        statusCode: 200,
        body: key
      }
    } catch (err) {
      console.log('Error:', err);
      if (attempt <= 3) {
        console.log('Trying again');
      }
    }
  } while (attempt <= 3)

  return {
    statusCode: 400,
    body: 'Error'
  }
}
