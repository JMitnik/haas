import AWS from '../../config/aws';
import config from '../../config/config';

class SMSService {
  send = (recipientNumber: string, message: string) => {
    if (config.env === 'local') return;

    const snsInstance = new AWS.SNS();
    snsInstance.setSMSAttributes({
      attributes: {
        DefaultSMSType: 'Transactional',
      },
    });

    // TODO: Do a phone number check
    // TODO: Do a message length check

    snsInstance.publish({
      Message: message,
      PhoneNumber: recipientNumber,
    }).promise().then((res) => {
      // TODO: What to do with successful smses?
      console.log(res);
    }).catch((err) => {
      // TODO: What to do with errorful smses?
      console.log(err);
    });
  };
}

export const smsService = new SMSService();

export default SMSService;
