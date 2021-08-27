import fetch from "node-fetch";

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

const missingCallbackResponse = {
  statusCode: 400,
  headers: {},
  body: 'callbackUrl is missing in body'
};

const missingPayloadResponse = {
  statusCode: 400,
  headers: {},
  body: 'payload is missing in body'
};

const successResponse = {
  statusCode: 200,
  headers: {},
  body: 'Update has been sent to API!'
};

interface MessageProps {
  payload: any;
  callbackUrl: string;
}

exports.main = async function(event: any, context: any) {
  try {
    if (!event?.Records[0]?.Sns?.Message) {
      console.error(`No record found for ${event?.Records[0]?.Sns}`)
      return missingNotificationResponse;
    }

    const { payload, callbackUrl }: MessageProps = JSON.parse(event?.Records[0]?.Sns?.Message);
    if (!callbackUrl) { return missingCallbackResponse; }
    if (!payload) { return missingPayloadResponse; }

    console.log(JSON.parse(event?.Records[0]?.Sns?.Message));
    const callbackUrlHttps = callbackUrl.replace(/^http:\/\//i, 'https://');

    try {
      const res = await fetch(callbackUrlHttps, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      console.log("Res:", res);
      console.log("Res response:", res.status);
      console.log("Res response:", await res.text);
      console.log("Res response:", await res.json());
      return successResponse;
    } catch (error: unknown) {
      console.error({ error, callbackUrlHttps });

      if (error instanceof Error) {
        return genericErrorResponse;
      }

      return genericErrorResponse;
    }

  } catch (error) {
    console.error({ error });

    console.log("Errored out");
    return genericErrorResponse;
  }
}
