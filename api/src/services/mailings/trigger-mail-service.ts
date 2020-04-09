import MailService, { MailServiceInputProps } from './mail-service';
import { Session } from '../../generated/resolver-types';

interface TriggerMailServiceInputProps extends MailServiceInputProps {

}

interface SendTriggerProps {
  from: string;
  to: string;
  userSession: Session;
}

class TriggerMailService extends MailService {
  sendTrigger({ from, to, userSession }: SendTriggerProps) {
    // TODO: Put in MJML
    const mailBody = `
      <div>
          <h1>Hello, from HAAS!</h1>
          <div>We noticed one of your customers gave a score of X</div>
          <div>Here what they also said</div>
          ${userSession.nodeEntries?.map(entry => `
            <div>
              ${entry.id}
            </div>
          `)}
      </div>
    `;

    this.sendMail({
      from,
      to,
      subject: 'You have a new trigger alert from HAAS',
      body: mailBody,
    });
  }
}

export default TriggerMailService;
