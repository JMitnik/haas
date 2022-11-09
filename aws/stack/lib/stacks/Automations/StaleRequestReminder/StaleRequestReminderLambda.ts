import fetch from "node-fetch";
import { JSONInputError } from "../../../helpers/errors";

interface MessageProps {
  payload: any;
  callbackUrl: string;
}

const authenticateLambda = async (apiUrl: string, authenticateEmail: string, workspaceEmail: string, authorizationHeader: string) => {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', lambda: authorizationHeader },
    body: JSON.stringify({
      query: `
        mutation authenticateLambda($input: AuthenticateLambdaInput) {
          authenticateLambda(input: $input)
        }
      `,
      operationName: "authenticateLambda",
      variables: {
        input: { "authenticateEmail": authenticateEmail, "workspaceEmail": workspaceEmail }
      }
    })
  }).then((res) => res.json()).then((data) => data);
  return res;
}

const verifyToken = async (apiUrl: string, token: string) => {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
  }).then((res) => res.json()).then((data) => data);
  return res;
}

const sendStaleRequestReminder = async (
  apiUrl: string,
  accessToken: string,
  automationActionId: string,
  workspaceId: string,
  daysNoAction: number = 7,
) => {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer:${accessToken}` },
    body: JSON.stringify({
      query: `
      mutation SendStaleRequestReminder($input: SendStaleRequestReminderInput!) {
        sendStaleRequestReminder(input: $input)
      }`,
      operationName: "sendStaleRequestReminder",
      variables: {
        input: {
          automationActionId,
          workspaceId,
          daysNoAction
        }
      }
    })
  }).then((res) => res.json()).then((data) => data);
  return res;
}

exports.main = async function (event: any, context: any) {
  const message = JSON.parse(event.Records?.[0]?.body)
  const apiUrl: string = message.API_URL;
  const authenticateEmail: string = message.AUTHENTICATE_EMAIL;
  const workspaceEmail: string = message.WORKSPACE_EMAIL;
  const workspaceSlug: string = message.WORKSPACE_SLUG;
  const authorizationKey = process.env.AUTOMATION_API_KEY;
  const automationActionId: string = message.AUTOMATION_ACTION_ID;
  const daysNoAction: number = message.DAYS_NO_ACTION;
  const workspaceId: string = message.WORKSPACE_ID;

  if (!apiUrl) throw new JSONInputError('apiUrl');
  if (!authenticateEmail) throw new JSONInputError('authenticateEmail');
  if (!workspaceEmail) throw new JSONInputError('workspaceEmail');
  if (!workspaceSlug) throw new JSONInputError('workspaceSlug');
  if (!authorizationKey) throw new JSONInputError('authorizationKey')
  if (!automationActionId) throw new JSONInputError('automationActionId');

  const result = await authenticateLambda(apiUrl, authenticateEmail, workspaceEmail, authorizationKey);
  console.log('result: ', result);
  const token = result?.data.authenticateLambda;
  const verifyTokenMutation = await verifyToken(apiUrl, token);
  const accessToken = verifyTokenMutation?.data?.verifyUserToken?.accessToken;
  console.log('Access token: ', accessToken);
  const resultTwo = await sendStaleRequestReminder(apiUrl, accessToken, automationActionId, workspaceId, daysNoAction);
  console.log('Result two: ', resultTwo);
  return accessToken;
}
