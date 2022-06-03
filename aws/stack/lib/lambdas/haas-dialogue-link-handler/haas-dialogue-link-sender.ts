import fetch from "node-fetch";
import { APIError, JSONInputError, NetworkError } from "../../helpers/errors";
import { sendToCallbackUrl } from "../../helpers/helpers";

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

const sendAutomationDialogueLink = async (apiUrl: string, accessToken: string, automationScheduleId: string, workspaceSlug: string) => {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer:${accessToken}` },
    body: JSON.stringify({
      query: `
      mutation sendAutomationDialogueLink ($input: SendAutomationDialogueLinkInput!) {
        sendAutomationDialogueLink(input: $input)
      }`,
      operationName: "sendAutomationDialogueLink",
      variables: {
        input: {
          automationScheduleId,
          workspaceSlug,
        }
      }
    })
  }).then((res) => res.json()).then((data) => data);
  return res;
}

exports.main = async function (event: any, context: any) {
  // if (!event?.Records[0]?.Sns?.Message) {
  //   throw new Error(`No record found for ${event?.Records[0]?.Sns}`);
  // }

  // const { payload, callbackUrl }: MessageProps = JSON.parse(event?.Records[0]?.Sns?.Message);
  const message = event; // JSON.parse(event);
  const apiUrl: string = message.API_URL;
  const authenticateEmail: string = message.AUTHENTICATE_EMAIL;
  const workspaceEmail: string = message.WORKSPACE_EMAIL;
  const workspaceSlug: string = message.WORKSPACE_SLUG;
  const automationScheduleId: string = message.AUTOMATION_SCHEDULE_ID;
  const authorizationKey = process.env.AUTOMATION_API_KEY;

  if (!apiUrl) throw new JSONInputError('apiUrl');
  if (!authenticateEmail) throw new JSONInputError('authenticateEmail');
  if (!workspaceEmail) throw new JSONInputError('workspaceEmail');
  if (!workspaceSlug) throw new JSONInputError('workspaceSlug');
  if (!authorizationKey) throw new JSONInputError('authorizationKey')
  if (!automationScheduleId) throw new JSONInputError('automationScheduleId');

  const result = await authenticateLambda(apiUrl, authenticateEmail, workspaceEmail, authorizationKey);
  console.log('result: ', result);
  const token = result?.data.authenticateLambda;
  const verifyTokenMutation = await verifyToken(apiUrl, token);
  const accessToken = verifyTokenMutation?.data?.verifyUserToken?.accessToken;
  console.log('Access token: ', accessToken);
  const resultTwo = await sendAutomationDialogueLink(apiUrl, accessToken, automationScheduleId, workspaceSlug);
  console.log('Result two: ', resultTwo);
  return accessToken;
}
