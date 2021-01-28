import Color from 'color';
import mjml2html from 'mjml';

import config from '../../../config/config';

interface makeInviteTemplateProps {
  recipientMail: string;
  customerName: string;
  token?: string;
  bgColor?: string;
}

const makeInviteTemplate = ({ recipientMail, customerName, token, bgColor = '#0059f8' }: makeInviteTemplateProps) => {
  const lighterBg = Color(bgColor).darken(0.1).hex();

  return mjml2html(`
        <mjml>
        <mj-body background-color=${bgColor}>
            <mj-section text-align="center">
                <mj-column>
                    <mj-image align="center" src="https://res.cloudinary.com/dx8khik9g/image/upload/v1586902351/haas/logo-haas.png" width="125px" alt="" />
                </mj-column>
            </mj-section>
            <mj-spacer height="30px" />
            <mj-section border-radius="5px 5px 0 0"  background-color=${lighterBg}>
                <mj-column>
                    <mj-text font-size="20px" color="white" align="left">
                        Welcome to the ${customerName} workspace!
                    </mj-text>
                </mj-column>
            </mj-section>
            <mj-section background-color="#eef1f5">
            <mj-column width="100%">
            <mj-text>
            Dear ${recipientMail},
            you have been invited to join ${customerName}'s workspace.
            </mj-text>

            
            ${token && `
              <mj-text>
              To sign in, please click on the following button:         
              </mj-text>
              <mj-button href="${config.dashboardUrl}/verify_token?token=${token}" background-color="#36d399">
              ✨ Magic link
              </mj-button>
              
              <mj-text>
              Please note that this link expires in <span style="font-weight: 700">3 days</span>. If you wish to request a new login link, simply
              go to <a href="${config.dashboardUrl}">the dashboard login</a> and fill in your mail again.
              </mj-text>
            `}
                </mj-column>
            </mj-section>
        </mj-body>
        </mjml>
    `).html;
};

export default makeInviteTemplate;
