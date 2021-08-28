import { APIError, JSONInputError, NetworkError } from "../../helpers/errors";
import { sendToCallbackUrl } from "../../helpers/helpers";

interface MessageProps {
  payload: any;
  callbackUrl: string;
}

exports.main = async function(event: any, context: any) {
  if (!event?.Records[0]?.Sns?.Message) {
    throw new Error(`No record found for ${event?.Records[0]?.Sns}`);
  }

  const { payload, callbackUrl }: MessageProps = JSON.parse(event?.Records[0]?.Sns?.Message);
  if (!callbackUrl) throw new JSONInputError('callbackUrl');
  if (!payload) throw new JSONInputError('payload');

  const callbackUrlHttps = callbackUrl.replace(/^http:\/\//i, 'https://');

  try {
    const res = await sendToCallbackUrl(callbackUrlHttps, payload);
    return res;
  } catch (error: unknown) {
    if (error instanceof APIError) { throw error }
    if (error instanceof Error) { throw new NetworkError(callbackUrl, error.message) }
  }
}
