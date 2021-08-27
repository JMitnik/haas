import { sendToCallbackUrl } from "../../helpers/helpers";

const missingNotificationResponse = {
  statusCode: 400,
  headers: {},
  body: 'No Sns message found'
};

const genericErrorResponse = {
  statusCode: 400,
  headers: {},
  body: 'General error'
};

const successResponse = {
  statusCode: 200,
  headers: {},
  body: 'Update has been sent to API!'
};

interface MessageProps {
  payload: string;
  callbackUrl: string;
}

exports.main = async function(event: any, context: any) {
  try {
    if (!event?.Records[0]?.Sns?.Message) {
      console.error(`No record found for ${event?.Records[0]?.Sns}`)
      return missingNotificationResponse;
    }

    const { payload, callbackUrl }: MessageProps = JSON.parse(event?.Records[0]?.Sns?.Message);
    await sendToCallbackUrl(callbackUrl, payload);

    return successResponse;
  } catch {
    console.log("Errored out");
    return genericErrorResponse;
  }
}
