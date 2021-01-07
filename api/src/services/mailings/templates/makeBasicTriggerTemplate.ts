import mjml2html from 'mjml';

const makeBasicTriggerTemplate = (recipientName: string, dialogueId: string, userScore: number) => mjml2html(`
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
                        Dear ${recipientName},
                        one of your set-up triggers has been activated.

                        One of your customers had an opinion regarding dialogue "${dialogueId}". 
                        You can find below details
                        more detail about their dialogue
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="white">
                <mj-column>
                    <mj-text align="center">They rated your dialogue with score</mj-text>
                    <mj-text font-size="30px" align="center">${userScore}</mj-text>
                    <mj-text align="center"><a class="mj-content" href="https://dashboard.haas.live">Visit the dashboard for more info</a></mj-text>
                </mj-column>
            </mj-section>

            <mj-section>
                <mj-column>
                    <mj-text align="center">
                        <a class="mj-content" href="https://haas.live/unsubscribe">Unsubscribe from the triggers</a>
                    </mj-text>
                </mj-column>
            </mj-section>+
        </mj-body>
        </mjml>
    `).html;

export default makeBasicTriggerTemplate;
