import mjml2html from 'mjml';

import { SessionWithEntries } from '../../models/session/SessionTypes';
import MailService, { MailServiceInputProps } from './mail-service';
import SessionService from '../../models/session/SessionService';
import NodeEntryService, { NodeEntryWithTypes } from '../../models/node-entry/NodeEntryService';

interface TriggerMailServiceInputProps extends MailServiceInputProps {

}

interface SendTriggerProps {
  from: string;
  to: string;
  userSession: SessionWithEntries;
}

class TriggerMailService extends MailService {
  sendTrigger({ from, to, userSession }: SendTriggerProps) {
    const mailBody = mjml2html(`
        <mjml>
        <mj-body background-color="#0059f8">
            <mj-section text-align="center">
                <mj-column>
                    <mj-image align="center" src="https://res.cloudinary.com/dx8khik9g/image/upload/v1586902351/haas/logo-haas.png" width="125px" alt="" />
                </mj-column>
            </mj-section>
            <mj-spacer height="30px" />
            <mj-section border-radius="5px 5px 0 0"  background-color="#6597fd">
                <mj-column>
                    <mj-text font-size="20px" color="white" align="left">
                        Notification: A new trigger has been activated!
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="#eef1f5">
                <mj-column width="100%">
                    <mj-text>
                        Dear ${to},
                        one of your set-up triggers has been activated.

                        One of your customers had an opinion regarding dialogue ${userSession.dialogueId},
                        for session nr ${userSession.id}. You can find below details
                        more detail about their dialogue
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="white">
                <mj-column>
                    <mj-text align="center">They rated your dialogue with score</mj-text>
                    <mj-text font-size="30px" align="center">${SessionService.getScoringEntryFromSession(userSession)}</mj-text>
                </mj-column>
            </mj-section>

            ${userSession.nodeEntries?.slice(1).map((entry) => `
            <mj-section border-top="1px solid #ddd" background-color="white">
                <mj-group>
                    <mj-column width="50%">
                        <mj-text>
                            You asked them:
                        </mj-text>
                        <mj-text>
                            ${entry.relatedNode?.title}
                        </mj-text>
                    </mj-column>
                    <mj-column width="50%">
                        <mj-text>
                            They answered:
                        </mj-text>
                        <mj-text>
                            ${NodeEntryService.getNodeEntryValue(entry)}
                        </mj-text>
                    </mj-column>
                </mj-group>
            </mj-section>
            `)}

            <mj-section>
                <mj-column>
                    <mj-text align="center">
                        <a class="mj-content" href="https://haas.live/unsubscribe">Unsubscribe from these triggers</a>
                    </mj-text>
                </mj-column>
            </mj-section>+
        </mj-body>
        </mjml>
    `).html;
    console.log(this);

    // this.sendMail({
    //   from,
    //   to,
    //   subject: 'You have a new trigger alert from HAAS',
    //   body: mailBody,
    // });
  }
}

export default TriggerMailService;
