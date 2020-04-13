import mjml2html from 'mjml';
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
    const testArr = [2, 3, 4];

    console.log('Sending mail!!!!');

    const mailBody = mjml2html(`
      <mjml>
        <mj-body background-color="#e0f2ff">
          <mj-section background-color="#4ca9eb">
              <mj-column>
                  <mj-text font-size="20px" color="white" align="center">
                      Dear ${to}
                  </mj-text>
              </mj-column>
          </mj-section>
          <mj-section background-color="white">
              <mj-column width="100%">
                  <mj-text>
                      We notice one of your customers had something to say about dialogue #${userSession.questionnaire?.id}.
                  </mj-text>
              </mj-column>
          </mj-section>

          ${userSession?.nodeEntries?.map((entry) => `
            <mj-section border-top="1px solid #ddd" background-color="white">
                <mj-column width="100%">
                    <mj-text>
                        For node ${entry.relatedNode?.id}: ${entry?.values?.map((val) => `
                          Value: ${val.numberValue || val.textValue})}
                        `)}
                    </mj-text>
                </mj-column>
            </mj-section>
          `)}

        </mj-body>
      </mjml>
    `).html;

    this.sendMail({
      from,
      to,
      subject: 'You have a new trigger alert from HAAS',
      body: mailBody,
    });
  }
}

export default TriggerMailService;
